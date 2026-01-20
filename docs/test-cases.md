# Test Cases

## 1. Functional Test Cases

### AC001: User Registration
- **Scenario:** New user registers with valid details.
- **Steps:** 1. Go to register. 2. Enter Name, Email, Phone, Password. 3. Submit.
- **Expected:** Success message, token generated, redirected to home.

### AC002: Login Flow
- **Scenario:** Existing user logs in.
- **Steps:** 1. Enter valid email/password. 2. Submit.
- **Expected:** JWT token returned, user profile loaded.

### AC003: Check Availability (Full Route)
- **Scenario:** Search Ahmedabad to Mumbai.
- **Precondition:** Bus empty.
- **Steps:** 1. Select AHMD -> MUM, Date. 2. Click Search.
- **Expected:** 40 seats shown as Available.

### AC004: Seat Selection and Locking
- **Scenario:** Select a seat.
- **Steps:** 1. Click Seat 1 (Lower).
- **Expected:** Seat turns Green (Selected). Price displayed.

### AC005: Booking with Meal
- **Scenario:** Complete booking with 1 meal.
- **Steps:** 1. Select Seat. 2. Add "Veg Thali". 3. Enter Passenger info. 4. Pay/Confirm.
- **Expected:** Booking created. Total price = Seat + Meal. Meal recorded in DB.

### AC006: Partial Route Booking Availability
- **Scenario:** Check availability after partial booking.
- **Precondition:** Seat 1 booked A -> B.
- **Steps:** 1. Search B -> D.
- **Expected:** Seat 1 is Available.
- **Steps:** 2. Search A -> C.
- **Expected:** Seat 1 is Booked/Unavailable.

### AC007: Cancel Booking
- **Scenario:** User cancels booking.
- **Steps:** 1. Go to My Bookings. 2. Click Cancel on active booking.
- **Expected:** Status -> Cancelled. Seats released for re-booking.

## 2. Edge Cases

### EC001: Concurrent Booking (Race Condition)
- **Scenario:** Two users book same seat same time.
- **Steps:** User A and B click "Confirm" at exact same moment for Seat 5.
- **Expected:** One succeeds, other gets "Seat already booked" error.

### EC002: Cancellation Window
- **Scenario:** Cancel 5 mins before departure.
- **Expected:** Error or reduced refund (based on policy).

### EC003: Overbooking
- **Scenario:** System tries to book 41st passenger.
- **Expected:** Hard block.

### EC004: Invalid Station Sequence
- **Scenario:** Booking C -> A (Reverse).
- **Expected:** Error "Invalid station order".

### EC005: Network Failure
- **Scenario:** Internet cut during "Confirm".
- **Expected:** System checks if transaction committed. If not, rollback.

## 3. UI/UX Validation

### UX001: Responsive Layout
- **Scenario:** Open on Mobile (375px width).
- **Expected:** Seat map stacks/scrolls horizontally without breaking.

### UX002: Loading States
- **Scenario:** Slow API.
- **Expected:** "Loading..." spinner shown, buttons disabled to prevent double-click.

### UX003: Accessibility
- **Scenario:** Screen reader focus.
- **Expected:** Seat buttons have aria-label "Seat 1 Lower Available price 500".
