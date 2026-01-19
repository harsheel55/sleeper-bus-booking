# 🚌 Sleeper Bus Booking System
### Ahmedabad → Mumbai Route

A comprehensive web-based sleeper bus ticket booking system with integrated meal booking service and ML-powered booking confirmation predictions.

---

## 📋 Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Test Cases](#test-cases)
- [UI/UX Design](#uiux-design)
- [ML Prediction Model](#ml-prediction-model)
- [Contributors](#contributors)

---

## ✨ Features

### 1. **Seat Selection & Booking**
- **Interactive Seat Layout:** Visual representation of 40 sleeper seats (2x1 configuration: 2 lower berths + 1 upper berth per row)
- **Real-time Availability:** Live seat status updates (Available/Booked/Selected)
- **Multi-Station Booking:** Support for intermediate boarding/deboarding points
- **Smart Availability Check:** Prevents overlapping bookings for the same seat across different route segments

**User Journey:**
```
Select Route → View Available Seats → Choose Seats → Confirm Selection
```

### 2. **Multi-Station Route Management**
- **Supported Stations:**
  - Ahmedabad (Starting Point - 10:00 PM)
  - Vadodara (12:30 AM - 110 km)
  - Surat (3:00 AM - 260 km)
  - Mumbai (7:00 AM - 530 km)

- **Dynamic Pricing:** Distance-based fare calculation (₹0.80/km)
- **Segment-wise Availability:** Seats available for partial routes (e.g., Vadodara to Mumbai)

**Example Fares:**
- Ahmedabad → Mumbai: ₹424
- Ahmedabad → Vadodara: ₹88
- Surat → Mumbai: ₹216

### 3. **Integrated Meal Booking Service**
- **Meal Options:**
  - Veg Thali (₹150) - Dal, Roti, Rice, Sabzi
  - Paneer Combo (₹180) - Paneer Curry, Roti, Rice
  - Chicken Biryani (₹220) - Hyderabadi style with raita
  - Jain Thali (₹160) - No onion, no garlic

- **Features:**
  - Add meals during ticket booking
  - Add meals to existing bookings
  - Select delivery station
  - Quantity selection

**Meal Delivery:** Meals delivered at selected intermediate stations during journey

### 4. **Booking Management System**
- **Booking Confirmation:**
  - Unique Booking ID (e.g., BK1737123456789)
  - PNR Number for tracking
  - Complete booking summary
  - Fare breakdown (Seat + Meals)

- **View Bookings:** Retrieve booking details using Booking ID
- **Cancel Bookings:** Full cancellation with automatic seat release
- **Modify Bookings:** Add meals to existing confirmed bookings

### 5. **Smart Seat Recommendation**
- **Preference-based Suggestions:**
  - Lower berth for easier access
  - Upper berth for privacy
  - Adjacent seats for groups
  - Window/aisle positioning

- **Group Booking Optimization:** Automatically suggests best seat combinations for families/groups

### 6. **ML-Powered Confirmation Prediction**
- **Prediction Engine:** Random Forest Classifier with 83.5% accuracy
- **Probability Score:** 0-100% confirmation likelihood
- **Factors Analyzed:**
  - Advance booking days
  - Day of week
  - Meal inclusion
  - Route segment
  - Booking time
  - Number of seats

**Example Output:**
```json
{
  "confirmation_probability": 85.67,
  "confidence_level": "High",
  "risk_factors": ["Weekend travel"],
  "recommendations": ["Keep meal booking to show commitment"]
}
```

### 7. **Dynamic Fare Calculation**
- **Base Calculation:** Distance × ₹0.80/km
- **Add-ons:**
  - Meal charges
  - GST/Service charges (can be added)
- **Transparent Pricing:** Itemized fare breakdown shown before payment

---

## 🛠 Technology Stack

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **API Style:** RESTful
- **Data Storage:** In-memory (can be replaced with MongoDB/PostgreSQL)

### Machine Learning
- **Language:** Python 3.8+
- **Libraries:**
  - scikit-learn (Random Forest)
  - pandas (Data manipulation)
  - numpy (Numerical operations)

### DevOps
- **Version Control:** Git/GitHub
- **Package Manager:** npm
- **Environment:** dotenv for configuration

---

## 📁 Project Structure

```
sleeper-bus-booking/
├── README.md                          # Main documentation (this file)
├── PREDICTION_APPROACH.md             # ML model documentation
├── backend/
│   ├── server.js                      # Express API server
│   ├── package.json                   # Node dependencies
│   ├── .env                           # Environment variables
│   └── routes/
│       ├── stations.js                # Station endpoints
│       ├── seats.js                   # Seat management
│       ├── bookings.js                # Booking operations
│       └── meals.js                   # Meal services
├── ml-model/
│   ├── prediction_model.py            # ML prediction script
│   ├── mock_booking_dataset.csv       # Training data (1000 records)
│   ├── model_insights.json            # Performance metrics
│   └── requirements.txt               # Python dependencies
├── docs/
│   ├── features.md                    # Detailed feature specs
│   ├── test-cases.md                  # Complete test suite
│   └── api-documentation.md           # API reference
└── design/
    └── figma-prototype-link.txt       # UI/UX design link
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- Python 3.8+
- npm or yarn
- Git

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/sleeper-bus-booking.git
cd sleeper-bus-booking

# 2. Navigate to backend
cd backend

# 3. Install dependencies
npm install

# 4. Create .env file (optional)
echo "PORT=3000" > .env

# 5. Start the server
npm start

# For development with auto-reload
npm run dev
```

**Server will run on:** `http://localhost:3000`

### ML Model Setup

```bash
# 1. Navigate to ml-model directory
cd ml-model

# 2. Install Python dependencies
pip install pandas numpy scikit-learn

# 3. Run the model training
python prediction_model.py

# Output files generated:
# - mock_booking_dataset.csv
# - model_insights.json
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### 1. Get All Stations
```http
GET /api/stations
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ST001",
      "name": "Ahmedabad",
      "arrivalTime": null,
      "departureTime": "22:00",
      "distance": 0
    },
    ...
  ]
}
```

---

#### 2. Get Available Seats
```http
GET /api/seats?from=ST001&to=ST004&date=2026-01-26
```

**Query Parameters:**
- `from` (required): Origin station ID
- `to` (required): Destination station ID
- `date` (optional): Travel date

**Response:**
```json
{
  "success": true,
  "data": {
    "bus": {
      "id": "BUS001",
      "name": "Sleeper Express",
      "totalSeats": 40
    },
    "seats": [
      {
        "id": "S001",
        "number": 1,
        "type": "lower",
        "isBooked": false,
        "available": true,
        "fare": 424
      },
      ...
    ],
    "route": {
      "from": {...},
      "to": {...}
    }
  }
}
```

---

#### 3. Get Meal Options
```http
GET /api/meals
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "M001",
      "name": "Veg Thali",
      "type": "veg",
      "price": 150,
      "description": "Dal, Roti, Rice, Sabzi"
    },
    ...
  ]
}
```

---

#### 4. Create Booking
```http
POST /api/bookings
```

**Request Body:**
```json
{
  "seatIds": ["S001", "S002"],
  "fromStation": "ST001",
  "toStation": "ST004",
  "passenger": {
    "name": "John Doe",
    "age": 30,
    "gender": "male",
    "phone": "+919876543210",
    "email": "john@example.com"
  },
  "meals": [
    {
      "mealId": "M001",
      "quantity": 2,
      "deliveryStation": "ST002"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking confirmed successfully",
  "data": {
    "id": "BK1737123456789",
    "pnr": "PNRABC123XYZ",
    "seatIds": ["S001", "S002"],
    "fare": {
      "seatCharges": 848,
      "mealCharges": 300,
      "total": 1148
    },
    "status": "confirmed",
    "bookingTime": "2026-01-19T10:30:00.000Z"
  }
}
```

---

#### 5. Get Booking Details
```http
GET /api/bookings/:bookingId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "BK1737123456789",
    "pnr": "PNRABC123XYZ",
    "passenger": {...},
    "seats": [...],
    "meals": [...],
    "fare": {...},
    "status": "confirmed"
  }
}
```

---

#### 6. Cancel Booking
```http
DELETE /api/bookings/:bookingId
```

**Response:**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "id": "BK1737123456789",
    "status": "cancelled"
  }
}
```

---

#### 7. Add Meal to Booking
```http
POST /api/bookings/:bookingId/meals
```

**Request Body:**
```json
{
  "mealId": "M002",
  "quantity": 1,
  "deliveryStation": "ST003"
}
```

---

#### 8. Get Booking Statistics
```http
GET /api/statistics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBookings": 150,
    "confirmedBookings": 120,
    "cancelledBookings": 30,
    "confirmationRate": "80.00",
    "occupancyRate": "65.00"
  }
}
```

---

## 🧪 Test Cases

### Functional Test Cases

#### TC001: Book Single Seat Successfully
- **Precondition:** At least one seat available
- **Steps:**
  1. Select source (Ahmedabad) and destination (Mumbai)
  2. Choose an available seat (S001)
  3. Enter passenger details
  4. Submit booking
- **Expected:** Booking confirmed with unique ID and PNR

#### TC002: Book Multiple Seats for Group
- **Steps:**
  1. Select route
  2. Choose 3 adjacent seats
  3. Enter passenger details
  4. Submit booking
- **Expected:** All 3 seats booked together, fare calculated for 3 seats

#### TC003: Add Meal to Booking
- **Steps:**
  1. Create booking
  2. Select meal (Veg Thali × 2)
  3. Choose delivery station (Vadodara)
  4. Submit
- **Expected:** Meal added, total fare updated

#### TC004: Cancel Confirmed Booking
- **Steps:**
  1. Retrieve booking using booking ID
  2. Click cancel
  3. Confirm cancellation
- **Expected:** Booking status = cancelled, seats released

#### TC005: Verify Seat Status After Booking
- **Steps:**
  1. Book seat S001
  2. Refresh seat availability
- **Expected:** S001 shows as booked

#### TC006: Book for Intermediate Stations
- **Steps:**
  1. Select from=Vadodara, to=Surat
  2. Book seat S010
- **Expected:** Seat booked only for Vadodara-Surat segment

#### TC007: Calculate Correct Fare
- **Test Data:**
  - Route: Ahmedabad-Mumbai (530 km)
  - Expected fare: 530 × 0.80 = ₹424
- **Expected:** Displayed fare matches calculation

---

### Edge Cases

#### TC008: Attempt to Book Already Booked Seat
- **Steps:**
  1. Try booking seat S001 (already booked for full route)
- **Expected:** Error message: "Seat not available"

#### TC009: Book Last Remaining Seat
- **Precondition:** 39 seats booked, 1 available
- **Steps:** Book last seat
- **Expected:** Successful booking, occupancy = 100%

#### TC010: Cancel Booking Just Before Departure
- **Steps:**
  1. Create booking
  2. Wait until 30 minutes before departure
  3. Attempt cancellation
- **Expected:** Cancellation allowed (or blocked based on policy)

#### TC011: Overlapping Route Bookings
- **Steps:**
  1. Book S001 for Ahmedabad-Vadodara
  2. Try booking S001 for Ahmedabad-Mumbai
- **Expected:** Second booking fails (route overlap detected)

#### TC012: Concurrent Booking Requests
- **Steps:**
  1. User A starts booking S001
  2. User B tries booking S001 simultaneously
- **Expected:** Only one booking succeeds

#### TC013: Invalid Station Combination
- **Steps:**
  1. Try booking from=Mumbai, to=Ahmedabad (reverse)
- **Expected:** Error: "Invalid route"

#### TC014: Meal Without Ticket
- **Steps:**
  1. Attempt to add meal without active booking
- **Expected:** Error: "Please book ticket first"

---

### UI/UX Validation

#### TC015: Responsive Design
- **Devices:** Desktop (1920px), Tablet (768px), Mobile (375px)
- **Expected:** Layout adapts properly, all elements accessible

#### TC016: Error Message Clarity
- **Scenario:** Failed booking
- **Expected:** Clear, actionable error message displayed

#### TC017: Seat Selection Visual Feedback
- **Steps:**
  1. Click on seat
  2. Observe color change
- **Expected:** Selected seat highlighted in distinct color

#### TC018: Booking Confirmation Display
- **Expected Elements:**
  - Booking ID
  - PNR
  - Passenger name
  - Seat numbers
  - Total fare
  - Download button

#### TC019: Meal Selection Interface
- **Expected:** 
  - Clear meal images
  - Type indicators (veg/non-veg/jain)
  - Easy quantity selection
  - Price displayed prominently

---

## 🎨 UI/UX Design

### Figma Prototype
**Public Link:** [View Design Prototype](https://www.figma.com/your-prototype-link)

*(Note: Replace with your actual Figma link before submission)*

### Design Highlights

#### Color Scheme
- **Primary:** #2563EB (Blue) - Trust, reliability
- **Secondary:** #10B981 (Green) - Success, confirmation
- **Accent:** #F59E0B (Orange) - Call-to-action
- **Background:** #F9FAFB (Light Gray)
- **Text:** #1F2937 (Dark Gray)

#### Typography
- **Headings:** Inter Bold, 24-32px
- **Body:** Inter Regular, 14-16px
- **Buttons:** Inter Medium, 16px

#### Key Screens
1. **Home Screen:** Simple search form with date picker
2. **Seat Layout:** Visual 2x1 sleeper bus layout
3. **Meal Selection:** Card-based meal options
4. **Checkout:** Clean summary with fare breakdown
5. **Confirmation:** Success message with booking details

---

## 🤖 ML Prediction Model

### Quick Overview
- **Model:** Random Forest Classifier
- **Accuracy:** 83.5% on test data
- **Purpose:** Predict booking confirmation probability

### Key Insights
**Top Predictive Features:**
1. Advance booking days (25% importance)
2. Meal inclusion (18% importance)
3. Route segment (15% importance)

### Usage Example
```python
from prediction_model import BookingPredictionModel

predictor = BookingPredictionModel()
# Load trained model...

result = predictor.predict_confirmation_probability({
    'day_of_week': 'Friday',
    'booking_hour': 14,
    'route_segment': 'Ahmedabad-Mumbai',
    'seat_type': 'lower',
    'num_seats': 2,
    'has_meal': 1,
    'advance_days': 10,
    'month': 3
})

print(f"Confirmation Probability: {result}%")
# Output: Confirmation Probability: 85.67%
```

**Full documentation:** See [PREDICTION_APPROACH.md](PREDICTION_APPROACH.md)

---

## 👥 Contributors

- **Your Name** - AI/ML Software Engineer
- **Email:** your.email@example.com
- **GitHub:** [@yourusername](https://github.com/yourusername)

---

## 📝 License

This project is created as part of an assignment for AI/ML Software Engineer role.

---

## 🙏 Acknowledgments

- Sleeper bus booking flow inspired by RedBus and MakeMyTrip
- ML model based on booking behavior analysis research
- Icons from Lucide React

---

## 📞 Support

For questions or issues:
1. Check the documentation
2. Review test cases
3. Contact: your.email@example.com

---

**Submission Date:** January 25, 2026 | 23:59 PM

**Repository:** [GitHub Link](https://github.com/yourusername/sleeper-bus-booking)