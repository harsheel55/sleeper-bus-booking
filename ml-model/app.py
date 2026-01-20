# app.py - Flask API for Booking Prediction Model
from flask import Flask, request, jsonify
from flask_cors import CORS
from prediction_model import BookingPredictionModel
import os

app = Flask(__name__)
CORS(app)

# Initialize and train the model on startup
print("Initializing Booking Prediction Model...")
predictor = BookingPredictionModel()

# Generate mock dataset and train model
print("Generating mock historical data...")
mock_data = predictor.generate_mock_dataset(n_samples=1000)

# Save mock dataset
mock_data.to_csv('mock_dataset.csv', index=False)
print(f"Mock dataset saved. Shape: {mock_data.shape}")

# Train model
print("Training model...")
training_results = predictor.train(mock_data)
print("Model training complete!")


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model': 'BookingPredictionModel',
        'version': '1.0.0'
    })


@app.route('/predict', methods=['POST'])
def predict_confirmation():
    """
    Predict booking confirmation probability
    
    Expected JSON body:
    {
        "day_of_week": "Friday",
        "booking_hour": 14,
        "route_segment": "Ahmedabad-Mumbai",
        "seat_type": "lower",
        "num_seats": 2,
        "has_meal": 1,
        "advance_days": 10,
        "month": 3
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Required fields
        required_fields = [
            'day_of_week', 'booking_hour', 'route_segment',
            'seat_type', 'num_seats', 'has_meal', 'advance_days', 'month'
        ]
        
        missing_fields = [f for f in required_fields if f not in data]
        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Missing required fields: {missing_fields}'
            }), 400
        
        # Get prediction
        probability = predictor.predict_confirmation_probability(data)
        
        # Determine risk level
        if probability >= 80:
            risk_level = 'low'
            recommendation = 'High confidence booking - likely to be confirmed'
        elif probability >= 60:
            risk_level = 'medium'
            recommendation = 'Moderate confidence - consider sending reminder'
        else:
            risk_level = 'high'
            recommendation = 'Low confidence - consider overbooking strategy'
        
        return jsonify({
            'success': True,
            'data': {
                'confirmation_probability': probability,
                'risk_level': risk_level,
                'recommendation': recommendation,
                'input': data
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/model-info', methods=['GET'])
def get_model_info():
    """Get model information and training metrics"""
    return jsonify({
        'success': True,
        'data': {
            'model_type': 'Random Forest Classifier',
            'n_estimators': 100,
            'training_samples': len(mock_data),
            'features': predictor.feature_columns,
            'train_accuracy': f"{training_results['train_accuracy']*100:.2f}%",
            'test_accuracy': f"{training_results['test_accuracy']*100:.2f}%",
            'feature_importance': training_results['feature_importance']
        }
    })


@app.route('/batch-predict', methods=['POST'])
def batch_predict():
    """
    Predict confirmation probability for multiple bookings
    
    Expected JSON body:
    {
        "bookings": [
            { booking_data_1 },
            { booking_data_2 },
            ...
        ]
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'bookings' not in data:
            return jsonify({
                'success': False,
                'error': 'No bookings data provided'
            }), 400
        
        results = []
        for i, booking in enumerate(data['bookings']):
            try:
                probability = predictor.predict_confirmation_probability(booking)
                results.append({
                    'index': i,
                    'confirmation_probability': probability,
                    'success': True
                })
            except Exception as e:
                results.append({
                    'index': i,
                    'error': str(e),
                    'success': False
                })
        
        return jsonify({
            'success': True,
            'data': results
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


if __name__ == '__main__':
    port = int(os.environ.get('ML_PORT', 5000))
    print(f"🤖 ML Prediction API running on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True)
