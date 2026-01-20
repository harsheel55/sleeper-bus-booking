# Implementation Plan - Sleeper Bus Booking System

This plan outlines the steps to complete the Sleeper Bus Booking System, focusing on modularizing the backend, populating documentation, and ensuring end-to-end functionality.

## Goal Description
Transform the current prototype into a production-ready, modular system with a persistent SQLite database, comprehensive documentation, and a working ML integration.

## Proposed Changes

### 1. Documentation (Part 1 & 2)
#### [MODIFY] [FEATURES.md](file:///d:/Portfolio%20Website/sleeper-bus-booking/docs/features.md)
- Populate with detailed feature descriptions, user stories, and acceptance criteria.
#### [MODIFY] [TEST_CASES.md](file:///d:/Portfolio%20Website/sleeper-bus-booking/docs/test-cases.md)
- Populate with comprehensive test scenarios (Functional, Edge, UI/UX).
#### [NEW] [DESIGN_SPECS.md](file:///d:/Portfolio%20Website/sleeper-bus-booking/docs/design-specs.md)
- Create wireframe descriptions and UI flow diagrams text.

### 2. Backend Development (Part 3)
Refactor `backend/` to use a Clean Architecture with Sequelize + SQLite.

#### [MODIFY] [package.json](file:///d:/Portfolio%20Website/sleeper-bus-booking/backend/package.json)
- Add `sequelize`, `sqlite3`, `joi`.

#### [NEW] Database/Models
- `src/config/database.js`: SQLite connection.
- `src/models/User.js`: Optional auth.
- `src/models/Bus.js`: Bus configuration.
- `src/models/Station.js`: Route stations.
- `src/models/Seat.js`: Bus layout (1-40).
- `src/models/Booking.js`: Transactional booking data.
- `src/models/Meal.js`: Meal catalog.
- `src/models/BookingMeal.js`: Many-to-many link.

#### [NEW] Logic & Controllers
- `src/controllers/seatController.js`: Handle `GET /seats` with overlap logic.
- `src/controllers/bookingController.js`: transaction management, seat locking (optimistic/database transaction).
- `src/routes/`: Router files.

#### [DELETE] [server.js](file:///d:/Portfolio%20Website/sleeper-bus-booking/backend/server.js)
- Replace with `src/app.js` and `src/server.js`.

### 3. ML Component (Part 4)
#### [VERIFY] [app.py](file:///d:/Portfolio%20Website/sleeper-bus-booking/ml-model/app.py)
- Ensure it properly loads the model and accepts JSON input matching the Node.js backend calls.

### 4. Verification Plan
- **Automated Tests**: Create a simple test script `test_api.js` to hit the endpoints.
- **Manual Verification**: Run `start-all.ps1` and verify flow.
