# API Documentation

## Base URL
`http://localhost:3000/api`

## Authentication
Currently, the API is public (open) for the assignment scope. Future versions will use JWT Bearer tokens.

## Endpoints

### Stations
#### Get All Stations
- **URL**: `/stations`
- **Method**: `GET`
- **Success Response**: 
  - Code: 200
  - Content: `[{ "id": "ST001", "name": "Ahmedabad", "distanceFromSource": 0, ... }]`

### Seats
#### Get Bus Seats & Availability
- **URL**: `/seats`
- **Method**: `GET`
- **Query Params**:
  - `fromStation` (required): e.g., ST001
  - `toStation` (required): e.g., ST004
  - `date` (required): YYYY-MM-DD
- **Description**: Returns all 40 seats with calculated availability based on overlapping bookings for the specific route segment.
- **Success Response**:
  - Code: 200
  - Content: `[{ "seatNumber": 1, "type": "lower", "available": true, "price": 424 }, ...]`

### Meals
#### Get Meal Menu
- **URL**: `/meals`
- **Method**: `GET`
- **Success Response**:
  - Code: 200
  - Content: `[{ "id": "M001", "name": "Veg Thali", "price": 150, "type": "veg" }, ...]`

### Bookings
#### Create Booking
- **URL**: `/bookings`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "fromStation": "ST001",
    "toStation": "ST004",
    "journeyDate": "2026-01-25",
    "seatIds": [1, 2],
    "passenger": {
      "name": "Harsheel",
      "email": "harsheel@example.com",
      "phone": "9876543210",
      "age": 25,
      "gender": "male"
    },
    "meals": [
      { "mealId": "M001", "quantity": 1, "deliveryStation": "ST002" }
    ]
  }
  ```
- **Success Response**:
  - Code: 201
  - Content: `{ "success": true, "bookingId": "...", "pnr": "PNR...", "totalAmount": 998 }`

#### Get Booking Details
- **URL**: `/bookings/:id`
- **Method**: `GET`
- **Success Response**:
  - Code: 200
  - Content: Full booking object with BookingSeats and BookingMeals.

#### Cancel Booking
- **URL**: `/bookings/:id`
- **Method**: `DELETE`
- **Success Response**:
  - Code: 200
  - Content: `{ "success": true, "message": "Cancelled" }`

### Predictions (ML)
#### Get Confirmation Probability
- **URL**: `/predict`
- **Method**: `POST`
- **Body**:
  ```json
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
  ```
- **Success Response**:
  - Code: 200
  - Content: `{ "success": true, "data": { "confirmation_probability": 85.5, ... } }`

## Error Codes
- **400**: Bad Request (Validation failed, Missing fields, Invalid Route).
- **404**: Not Found (Booking/Station not found).
- **409**: Conflict (Seat already booked).
- **500**: Internal Server Error.
