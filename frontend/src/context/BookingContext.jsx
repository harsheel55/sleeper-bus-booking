import { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};

export default function BookingProvider({ children }) {
  const [bookingData, setBookingData] = useState({
    fromStation: null,
    toStation: null,
    travelDate: '',
    selectedSeats: [],
    selectedMeals: [],
    passengers: [],
    contactInfo: {
      email: '',
      phone: ''
    },
    totalFare: 0,
    prediction: null
  });

  const updateBooking = (updates) => {
    setBookingData(prev => ({ ...prev, ...updates }));
  };

  const resetBooking = () => {
    setBookingData({
      fromStation: null,
      toStation: null,
      travelDate: '',
      selectedSeats: [],
      selectedMeals: [],
      passengers: [],
      contactInfo: {
        email: '',
        phone: ''
      },
      totalFare: 0,
      prediction: null
    });
  };

  const calculateTotalFare = () => {
    const seatFare = bookingData.selectedSeats.reduce((sum, seat) => sum + (seat.price || 0), 0);
    const mealFare = bookingData.selectedMeals.reduce((sum, meal) => sum + (meal.price * meal.quantity), 0);
    return seatFare + mealFare;
  };

  return (
    <BookingContext.Provider value={{ 
      bookingData, 
      updateBooking, 
      resetBooking,
      calculateTotalFare 
    }}>
      {children}
    </BookingContext.Provider>
  );
}
