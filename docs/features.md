# Features & Requirements

## Core Features

### 1. Smart Seat Selection System (Sleeper Layout)
**Description:** Interactive visual representation of the bus layout allowing users to select specific upper/lower berths.
**Priority:** Must-have
**User Story:** As a traveler, I want to see the bus layout with upper/lower berths so I can choose a seat that suits my preference (e.g., lower for elderly).
**Acceptance Criteria:**
- Display 2x1 sleeper configuration (40 seats).
- Color-coded status: Available (White), Booked (Red), Selected (Green).
- Hover tooltip showing seat number and price.
- Toggle between Lower and Upper deck views.

### 2. Multi-Station Route Booking
**Description:** Logic to allow booking between intermediate stations (Ahmedabad -> Vadodara -> Surat -> Mumbai).
**Priority:** Must-have
**User Story:** As a commuter from Vadodara to Surat, I want to book a seat for just that segment so I don't pay for the full journey.
**Acceptance Criteria:**
- User selects From/To stations.
- System filters availability based on segments.
- Allow Seat 1 to be booked for A->B and then again for B->D.
- Prevent overlapping bookings (e.g., if A->C is booked, A->B is blocked).

### 3. Integrated Meal Booking
**Description:** Order meals to be delivered at specific intermediate stations.
**Priority:** Should-have
**User Story:** As a long-distance traveler, I want to pre-order dinner to be delivered at Surat station so I don't have to carry food.
**Acceptance Criteria:**
- Specific menu items available per station.
- Add to cart flow integrated with ticket booking.
- Quantity selection.
- Price added to total ticket fare.

### 4. Dynamic Pricing Engine
**Description:** Fare calculation based on distance between selected stations.
**Priority:** Must-have
**User Story:** As a user, I want fair pricing based on the distance I travel.
**Acceptance Criteria:**
- Base fare per km configuration.
- Total calculation: `Distance * Rate`.
- Display breakdown (Base + GST + Meals).

### 5. ML-Powered Confirmation Probability
**Description:** Predicts likelihood of confirmation/availability.
**Priority:** Nice-to-have (Assignment Requirement)
**User Story:** As a user planning a trip, I want to know if tickets are likely to sell out.
**Acceptance Criteria:**
- Display "High/Medium/Low" chance.
- Percentage score shown on search results.

### 6. Booking Management System
**Description:** Portal to view, print, and cancel bookings.
**Priority:** Must-have
**User Story:** As a user, I want to cancel my ticket if my plans change and get a refund.
**Acceptance Criteria:**
- Retrieve booking by PNR.
- Cancel booking button with confirmation.
- Refund amount calculation.
- View Ticket/Print option.

### 7. User Profiles & History
**Description:** Save passenger details for faster checkout.
**Priority:** Should-have
**User Story:** As a frequent traveler, I want my details auto-filled.
**Acceptance Criteria:**
- Registration/Login.
- "My Bookings" history list.
