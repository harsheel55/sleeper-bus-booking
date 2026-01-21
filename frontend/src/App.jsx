import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import SeatSelectionPage from './pages/SeatSelectionPage'
import MealBookingPage from './pages/MealBookingPage'
import PassengerDetailsPage from './pages/PassengerDetailsPage'
import ConfirmationPage from './pages/ConfirmationPage'
import ManageBookingPage from './pages/ManageBookingPage'
import BookingProvider from './context/BookingContext'

function App() {
  return (
    <BookingProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/select-seats" element={<SeatSelectionPage />} />
          <Route path="/add-meals" element={<MealBookingPage />} />
          <Route path="/passenger-details" element={<PassengerDetailsPage />} />
          <Route path="/confirmation/:bookingId" element={<ConfirmationPage />} />
          <Route path="/manage-booking" element={<ManageBookingPage />} />
        </Routes>
      </Layout>
    </BookingProvider>
  )
}

export default App
