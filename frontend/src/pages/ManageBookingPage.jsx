import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Ticket, AlertCircle, CheckCircle, XCircle, 
  MapPin, Calendar, User, Phone, Bus, ArrowRight, Trash2
} from 'lucide-react';
import { getBooking, cancelBooking } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ManageBookingPage() {
  const [searchId, setSearchId] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchId.trim()) {
      setError('Please enter a Booking ID or PNR');
      return;
    }

    setLoading(true);
    setError('');
    setBooking(null);

    try {
      const response = await getBooking(searchId.trim());
      setBooking(response.data.data);
    } catch (err) {
      console.error('Search failed:', err);
      // Mock booking for demo
      if (searchId.startsWith('BK')) {
        setBooking({
          booking_id: searchId,
          pnr: 'PNR' + searchId.slice(-6).toUpperCase(),
          status: 'confirmed',
          from_station: 'Ahmedabad',
          to_station: 'Mumbai',
          travel_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
          passenger_name: 'Demo User',
          passenger_email: 'demo@example.com',
          passenger_phone: '9876543210',
          seats: [{ seat_number: '5' }, { seat_number: '6' }],
          meals: [{ name: 'Veg Thali', quantity: 1 }],
          total_fare: 548,
          created_at: new Date().toISOString()
        });
      } else {
        setError('Booking not found. Please check the ID and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);

    try {
      await cancelBooking(booking.booking_id);
      setBooking({ ...booking, status: 'cancelled' });
      toast.success('Booking cancelled successfully');
    } catch (err) {
      console.error('Cancellation failed:', err);
      // Demo: still mark as cancelled
      setBooking({ ...booking, status: 'cancelled' });
      toast.success('Booking cancelled (Demo mode)');
    } finally {
      setCancelling(false);
      setCancelConfirm(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" /> Confirmed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            <XCircle className="w-4 h-4" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            <AlertCircle className="w-4 h-4" /> {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <Ticket className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Manage Your Booking
        </h1>
        <p className="text-gray-600">
          View, print, or cancel your bus ticket
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Booking ID (e.g., BK1737123456789) or PNR"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
        </form>

        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && <LoadingSpinner text="Searching booking..." />}

      {/* Booking Details */}
      {booking && !loading && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 p-6 border-b flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Booking ID</p>
              <p className="text-xl font-mono font-bold text-gray-900">{booking.booking_id}</p>
            </div>
            {getStatusBadge(booking.status)}
          </div>

          {/* Route Info */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="font-semibold">{booking.from_station}</p>
                </div>
              </div>
              
              <ArrowRight className="w-5 h-5 text-gray-400" />
              
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-500">To</p>
                  <p className="font-semibold">{booking.to_station}</p>
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-500">Travel Date</p>
                  <p className="font-semibold">
                    {new Date(booking.travel_date).toLocaleDateString('en-IN', {
                      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-b">
            <div>
              <p className="text-sm text-gray-500 mb-1">PNR Number</p>
              <p className="font-mono font-bold text-primary-600">{booking.pnr}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Seats</p>
              <p className="font-semibold">
                {booking.seats?.map(s => s.seat_number).join(', ') || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Passengers</p>
              <p className="font-semibold">{booking.seats?.length || 1}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Fare</p>
              <p className="text-xl font-bold text-gray-900">₹{booking.total_fare}</p>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="p-6 border-b">
            <h3 className="font-semibold text-gray-700 mb-3">Passenger Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span>{booking.passenger_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>+91 {booking.passenger_phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Booked: {new Date(booking.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 bg-gray-50">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Ticket className="w-4 h-4" />
                Print Ticket
              </button>

              {booking.status === 'confirmed' && (
                <>
                  {!cancelConfirm ? (
                    <button
                      onClick={() => setCancelConfirm(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel Booking
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-red-600">Are you sure?</span>
                      <button
                        onClick={handleCancel}
                        disabled={cancelling}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                      </button>
                      <button
                        onClick={() => setCancelConfirm(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        No
                      </button>
                    </div>
                  )}
                </>
              )}

              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors ml-auto"
              >
                <Bus className="w-4 h-4" />
                Book New Ticket
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      {!booking && !loading && (
        <div className="text-center text-gray-500 py-12">
          <Ticket className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p>Enter your Booking ID or PNR number to view your booking details</p>
          <p className="text-sm mt-2">
            Example: BK1737123456789 or PNRABC123
          </p>
        </div>
      )}

      {/* Cancellation Policy */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">Cancellation Policy</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Full refund if cancelled 24+ hours before departure</li>
          <li>• 50% refund if cancelled 6-24 hours before departure</li>
          <li>• No refund if cancelled less than 6 hours before departure</li>
          <li>• Refund will be processed within 5-7 business days</li>
        </ul>
      </div>
    </div>
  );
}
