import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle, Download, Home, Ticket, MapPin, Calendar, 
  User, Phone, Mail, QrCode, Sparkles, Clock, Bus
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { getBooking } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ConfirmationPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { bookingData, resetBooking } = useBooking();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await getBooking(bookingId);
      setBooking(response.data.data);
    } catch (error) {
      console.error('Failed to fetch booking:', error);
      // Use context data for demo
      if (bookingData.fromStation) {
        setBooking({
          booking_id: bookingId,
          pnr: 'PNR' + bookingId.slice(-6).toUpperCase(),
          status: 'confirmed',
          from_station: bookingData.fromStation?.name,
          to_station: bookingData.toStation?.name,
          travel_date: bookingData.travelDate,
          passenger_name: bookingData.passengers?.[0]?.name || 'Guest',
          passenger_email: bookingData.contactInfo?.email || 'guest@example.com',
          passenger_phone: bookingData.contactInfo?.phone || '9876543210',
          seats: bookingData.selectedSeats || [],
          meals: bookingData.selectedMeals || [],
          total_fare: calculateTotal(),
          prediction: bookingData.prediction
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const seatsFare = bookingData.selectedSeats?.reduce((sum, seat) => sum + seat.price, 0) || 0;
    const mealsFare = bookingData.selectedMeals?.reduce((sum, meal) => sum + (meal.price * meal.quantity), 0) || 0;
    return seatsFare + mealsFare;
  };

  const handleNewBooking = () => {
    resetBooking();
    navigate('/');
  };

  if (loading) {
    return <LoadingSpinner text="Loading booking details..." />;
  }

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-2">Booking Not Found</h2>
          <p className="mb-4">We couldn't find the booking with ID: {bookingId}</p>
          <Link to="/" className="text-primary-600 hover:underline">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-gray-600">
          Your ticket has been booked successfully. Details sent to your email.
        </p>
      </div>

      {/* Ticket Card */}
      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden mb-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Bus className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">SleeperBus</h2>
                <p className="text-primary-100 text-sm">E-Ticket</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-primary-100 text-sm">Booking ID</p>
              <p className="text-xl font-mono font-bold">{booking.booking_id}</p>
            </div>
          </div>
        </div>

        {/* Route Info */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="text-xl font-bold text-gray-900">{booking.from_station}</p>
                <p className="text-sm text-gray-500">10:00 PM</p>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                <div className="w-20 h-0.5 bg-gray-300"></div>
                <Bus className="w-5 h-5" />
                <div className="w-20 h-0.5 bg-gray-300"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              </div>
              <div>
                <p className="text-sm text-gray-500">To</p>
                <p className="text-xl font-bold text-gray-900">{booking.to_station}</p>
                <p className="text-sm text-gray-500">7:00 AM</p>
              </div>
            </div>
            
            <div className="text-center px-4 py-2 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Travel Date</p>
              <p className="font-semibold">
                {new Date(booking.travel_date).toLocaleDateString('en-IN', {
                  weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* PNR */}
          <div>
            <p className="text-sm text-gray-500 mb-1">PNR Number</p>
            <p className="font-mono font-bold text-lg text-primary-600">{booking.pnr}</p>
          </div>

          {/* Seats */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Seats</p>
            <p className="font-semibold">
              {booking.seats?.map(s => s.seat_number || s).join(', ') || 'N/A'}
            </p>
          </div>

          {/* Status */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Confirmed
            </span>
          </div>

          {/* Total Fare */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Fare</p>
            <p className="text-2xl font-bold text-gray-900">₹{booking.total_fare}</p>
          </div>
        </div>

        {/* Passenger Info */}
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-3">Passenger Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span>{booking.passenger_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{booking.passenger_email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>+91 {booking.passenger_phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Meals if any */}
        {booking.meals && booking.meals.length > 0 && (
          <div className="px-6 pb-6">
            <div className="bg-amber-50 rounded-lg p-4">
              <h3 className="font-semibold text-amber-800 mb-2">🍽️ Meals Ordered</h3>
              <div className="text-sm text-amber-700">
                {booking.meals.map((meal, idx) => (
                  <span key={idx}>
                    {meal.name || 'Meal'} x{meal.quantity}
                    {idx < booking.meals.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ML Prediction */}
        {booking.prediction && (
          <div className="px-6 pb-6">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-800">AI Prediction</h3>
              </div>
              <p className="text-sm text-purple-700">
                Confirmation Probability: <span className="font-bold">{booking.prediction.confirmation_probability?.toFixed(1) || 85}%</span>
                {' '}• Confidence: {booking.prediction.confidence_level || 'High'}
              </p>
            </div>
          </div>
        )}

        {/* QR Code placeholder */}
        <div className="px-6 pb-6 text-center">
          <div className="inline-block p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg">
            <QrCode className="w-24 h-24 mx-auto text-gray-400" />
            <p className="text-xs text-gray-500 mt-2">Scan at boarding</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Download className="w-5 h-5" />
          Download Ticket
        </button>
        
        <button
          onClick={handleNewBooking}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          <Home className="w-5 h-5" />
          Book Another Ticket
        </button>

        <Link
          to="/manage-booking"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
        >
          <Ticket className="w-5 h-5" />
          Manage Booking
        </Link>
      </div>

      {/* Important Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Important Information</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Please arrive at the boarding point 15 minutes before departure</li>
          <li>• Carry a valid ID proof along with this e-ticket</li>
          <li>• Cancellation is allowed up to 2 hours before departure</li>
          <li>• For any queries, contact: +91 98765 43210</li>
        </ul>
      </div>
    </div>
  );
}
