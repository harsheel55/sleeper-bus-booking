# Design Specifications & Wireframes

## Visual Style Guide
- **Primary Color:** #2563EB (Royal Blue) - Trust & Professionalism.
- **Secondary:** #F59E0B (Amber) - Call to actions (Book, Select).
- **Background:** #F3F4F6 (Light Grey) for depth.
- **Typography:** 'Inter' or 'Roboto'. Clean, legible sans-serif.

## Screen Structures (Wireframes)

### 1. Landing / Search
- **Header:** Logo, Login/Profile, Currency/Lang.
- **Hero Section:** "Comfortable Sleeper Booking".
- **Search Widget:**
  - inputs: From (Dropdown), To (Dropdown), Date (Datepicker).
  - Button: "Search Buses".
- **Footer:** Links.

### 2. Search Results
- **List Item:** Bus Name, Dep Time --- Arr Time, Duration, Price, "View Seats" button.
- **Filter:** Upper/Lower deck, Price range.

### 3. Seat Selection (The Core UI)
- **Top:** Legend (Available [White], Booked [Grey], Selected [Green], Female [Pink]).
- **Main Container:**
  - **Lower Deck:** Grid of seats. 2 columns - Aisle - 1 column. Or 1-1 layout.
  - **Upper Deck:** Toggle/Tab to switch view.
- **Side Panel/Bottom Sheet:** Selected seats list, Subtotal.
- **Action:** "Proceed to Passenger Details".

### 4. Passenger & Meal Details
- **Form:** Name, Age, Gender (Per seat).
- **Meal Section:**
  - "Add Meal for this passenger?" Switch/Checkbox.
  - If Yes -> Show Cards (Veg Thali, Biryani) with Qty selector.
- **Contact Info:** Email, Phone.

### 5. Review & Pay
- **Summary:** Route, Date, Seats, Meals.
- **Fare Breakdown:** Base Fare + Meal Cost + GST = Total.
- **Payment Placeholder:** "Pay via UPI/Card" (Mock Button).

### 6. Confirmation
- **Success Icon**: Large Green Check.
- **Ticket Card**: PNR, QRCode, details.
- **Actions**: "Download PDF", "Book Return".

## User Flow Diagram
1. **Start** -> Landing Page.
2. **Search** -> Result List.
3. **Select Details** -> Seat Map.
4. **Choose Seat** -> (Seat Locked Temp?).
5. **Input Info** -> Add Meals -> Passenger Form.
6. **Payment** -> Gateway Mock -> Success.
7. **End** -> Ticket View.
