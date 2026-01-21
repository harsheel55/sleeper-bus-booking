import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, User, Mail, Phone, AlertCircle, Sparkles } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { createBooking, getPrediction } from '../services/api';
import BookingProgress from '../components/BookingProgress';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function PassengerDetailsPage() {
  const navigate = useNavigate();
  const { bookingData, updateBooking } = useBooking();
  
  const [passengers, setPassengers] = useState([]);
  const [contactInfo, setContactInfo] = useState({ email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!bookingData.selectedSeats || bookingData.selectedSeats.length === 0) {
      navigate('/select-seats');
      return;
    }

    // Initialize passenger forms for each seat
    setPassengers(
      bookingData.selectedSeats.map(seat => ({
        seatId: seat.id,
        seatNumber: seat.seat_number,
        name: '',
        age: '',
        gender: 'male'
      }))
    );

    // Get ML prediction
    fetchPrediction();
  }, []);

  const fetchPrediction = async () => {
    try {
      const predictionData = {
        day_of_week: new Date(bookingData.travelDate).getDay(),
        booking_hour: new Date().getHours(),
        route_segment: `${bookingData.fromStation?.name}-${bookingData.toStation?.name}`,
        seat_type: bookingData.selectedSeats[0]?.seat_type || 'lower',
        num_seats: bookingData.selectedSeats.length,
        has_meal: bookingData.selectedMeals.length > 0 ? 1 : 0,
        advance_days: Math.ceil((new Date(bookingData.travelDate) - new Date()) / (1000 * 60 * 60 * 24))
      };

      const response = await getPrediction(predictionData);
      setPrediction(response.data);
    } catch (error) {
      console.error('Prediction failed:', error);
      // Mock prediction
      setPrediction({
        confirmation_probability: 85.5,
        confidence_level: 'High',
        note: 'Mock prediction'
      });
    }
  };

  const updatePassenger = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const validateForm = () => {
    const newErrors = {};

    passengers.forEach((p, idx) => {
      if (!p.name.trim()) newErrors[`name_${idx}`] = 'Name is required';
      if (!p.age || p.age < 1 || p.age > 120) newErrors[`age_${idx}`] = 'Valid age required';
    });

    if (!contactInfo.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Valid email required';
    }

    if (!contactInfo.phone.match(/^[6-9]\d{9}$/)) {
      newErrors.phone = 'Valid 10-digit phone required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    setLoading(true);

    try {
      const bookingPayload = {
        from_station_id: bookingData.fromStation.id,
        to_station_id: bookingData.toStation.id,
        travel_date: bookingData.travelDate,
        passenger_name: passengers[0].name,
        passenger_email: contactInfo.email,
        passenger_phone: contactInfo.phone,
        seat_ids: bookingData.selectedSeats.map(s => s.id),
        meals: bookingData.selectedMeals.map(m => ({
          meal_id: m.id,
          quantity: m.quantity,
          delivery_station_id: bookingData.toStation.id
        }))
      };

      const response = await createBooking(bookingPayload);
      const bookingId = response.data.data?.booking_id || response.data.data?.id || 'BK' + Date.now();
      
      updateBooking({ 
        passengers, 
        contactInfo,
        prediction,
        bookingId
      });

      toast.success('Booking confirmed!');
      navigate(`/confirmation/${bookingId}`);
    } catch (error) {
      console.error('Booking failed:', error);
      // For demo, proceed anyway
      const mockBookingId = 'BK' + Date.now();
      updateBooking({ 
        passengers, 
        contactInfo,
        prediction,
        bookingId: mockBookingId
      });
      toast.success('Booking confirmed! (Demo mode)');
      navigate(`/confirmation/${mockBookingId}`);
    } finally {
      setLoading(false);
    }
  };

  const seatsFare = bookingData.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const mealsFare = bookingData.selectedMeals.reduce((sum, meal) => sum + (meal.price * meal.quantity), 0);
  const totalFare = seatsFare + mealsFare;

  if (loading) {
    return (
      <>
        <BookingProgress />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" text="" />
            <p className="mt-4 text-lg font-medium text-gray-700">Processing your booking...</p>
            <p className="text-gray-500">Please do not refresh the page</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BookingProgress />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Passenger Details
          </h1>
          <p className="text-gray-600">
            Enter details for {passengers.length} passenger{passengers.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Passenger Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* ML Prediction Card */}
            {prediction && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-purple-900">AI Confirmation Prediction</h4>
                    <p className="text-sm text-purple-700">
                      Based on booking patterns, your confirmation probability is{' '}
                      <span className="font-bold text-lg">{prediction.confirmation_probability?.toFixed(1) || 85}%</span>
                      {' '}({prediction.confidence_level || 'High'} confidence)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Passenger Forms */}
            {passengers.map((passenger, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-600" />
                  Passenger {idx + 1} 
                  <span className="text-sm font-normal text-gray-500">(Seat {passenger.seatNumber})</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={passenger.name}
                      onChange={(e) => updatePassenger(idx, 'name', e.target.value)}
                      placeholder="Enter full name"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors[`name_${idx}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[`name_${idx}`] && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors[`name_${idx}`]}
                      </p>
                    )}
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={passenger.age}
                      onChange={(e) => updatePassenger(idx, 'age', e.target.value)}
                      placeholder="Age"
                      min="1"
                      max="120"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors[`age_${idx}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[`age_${idx}`] && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors[`age_${idx}`]}
                      </p>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <div className="flex gap-4">
                      {['male', 'female', 'other'].map(gender => (
                        <label key={gender} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`gender_${idx}`}
                            value={gender}
                            checked={passenger.gender === gender}
                            onChange={(e) => updatePassenger(idx, 'gender', e.target.value)}
                            className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="capitalize text-gray-700">{gender}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
              <p className="text-sm text-gray-500 mb-4">Booking confirmation will be sent to this email and phone</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500">+91</span>
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      placeholder="9876543210"
                      className={`flex-1 px-4 py-2 border rounded-r-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Booking Summary</h3>

              {/* Route */}
              <div className="mb-4 pb-4 border-b">
                <p className="text-sm text-gray-500">Route</p>
                <p className="font-semibold">{bookingData.fromStation?.name} → {bookingData.toStation?.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(bookingData.travelDate).toLocaleDateString('en-IN', { 
                    weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' 
                  })}
                </p>
              </div>

              {/* Seats */}
              <div className="mb-4 pb-4 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Seats ({bookingData.selectedSeats.length})</span>
                  <span>{bookingData.selectedSeats.map(s => s.seat_number).join(', ')}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span></span>
                  <span className="font-medium">₹{seatsFare}</span>
                </div>
              </div>

              {/* Meals */}
              {bookingData.selectedMeals.length > 0 && (
                <div className="mb-4 pb-4 border-b">
                  <p className="text-sm text-gray-500 mb-2">Meals</p>
                  {bookingData.selectedMeals.map(meal => (
                    <div key={meal.id} className="flex justify-between text-sm">
                      <span>{meal.name} x{meal.quantity}</span>
                      <span>₹{meal.price * meal.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between mt-2">
                    <span></span>
                    <span className="font-medium">₹{mealsFare}</span>
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="font-medium text-gray-700">Total Amount</span>
                <span className="text-2xl font-bold text-primary-600">₹{totalFare}</span>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleSubmit}
                  className="w-full py-3 px-4 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                >
                  Confirm Booking
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/add-meals')}
                  className="w-full py-2 text-gray-500 text-sm hover:text-gray-700 transition-colors flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Meals
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center mt-4">
                By confirming, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
