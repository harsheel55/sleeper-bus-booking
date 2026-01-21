import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Info, Users } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { getSeats } from '../services/api';
import BookingProgress from '../components/BookingProgress';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function SeatSelectionPage() {
  const navigate = useNavigate();
  const { bookingData, updateBooking } = useBooking();
  
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [activeDeck, setActiveDeck] = useState('lower');

  useEffect(() => {
    if (!bookingData.fromStation || !bookingData.toStation) {
      navigate('/');
      return;
    }
    fetchSeats();
  }, [bookingData.fromStation, bookingData.toStation]);

  const fetchSeats = async () => {
    try {
      const response = await getSeats(
        bookingData.fromStation.id,
        bookingData.toStation.id
      );
      setSeats(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch seats:', error);
      // Generate mock seats
      const mockSeats = generateMockSeats();
      setSeats(mockSeats);
    } finally {
      setLoading(false);
    }
  };

  const generateMockSeats = () => {
    const seats = [];
    for (let i = 1; i <= 40; i++) {
      const row = Math.ceil(i / 4);
      const position = i % 4;
      seats.push({
        id: i,
        seat_number: `${i}`,
        seat_type: i <= 20 ? 'lower' : 'upper',
        position: position === 1 || position === 2 ? 'left' : 'right',
        row: row <= 10 ? row : row - 10,
        is_available: Math.random() > 0.3,
        price: calculatePrice()
      });
    }
    return seats;
  };

  const calculatePrice = () => {
    if (!bookingData.fromStation || !bookingData.toStation) return 0;
    const distances = {
      1: { 2: 110, 3: 260, 4: 530 },
      2: { 3: 150, 4: 420 },
      3: { 4: 270 }
    };
    const fromSeq = bookingData.fromStation.sequence || bookingData.fromStation.id;
    const toSeq = bookingData.toStation.sequence || bookingData.toStation.id;
    const distance = distances[fromSeq]?.[toSeq] || 300;
    return Math.round(distance * 0.8);
  };

  const toggleSeat = (seat) => {
    if (!seat.is_available) return;

    const isSelected = selectedSeats.find(s => s.id === seat.id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 6) {
        toast.error('Maximum 6 seats allowed per booking');
        return;
      }
      setSelectedSeats([...selectedSeats, { ...seat, price: calculatePrice() }]);
    }
  };

  const getSeatClass = (seat) => {
    const isSelected = selectedSeats.find(s => s.id === seat.id);
    if (isSelected) return 'seat seat-selected';
    if (!seat.is_available) return 'seat seat-booked';
    return 'seat seat-available';
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }
    updateBooking({ selectedSeats });
    navigate('/add-meals');
  };

  const lowerDeckSeats = seats.filter(s => s.seat_type === 'lower');
  const upperDeckSeats = seats.filter(s => s.seat_type === 'upper');
  const displaySeats = activeDeck === 'lower' ? lowerDeckSeats : upperDeckSeats;

  const totalFare = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  if (loading) {
    return (
      <>
        <BookingProgress />
        <LoadingSpinner text="Loading seat map..." />
      </>
    );
  }

  return (
    <>
      <BookingProgress />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Route Info */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="font-semibold text-lg">{bookingData.fromStation?.name}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">To</p>
                <p className="font-semibold text-lg">{bookingData.toStation?.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Travel Date</p>
              <p className="font-semibold">{new Date(bookingData.travelDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {/* Deck Toggle */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveDeck('lower')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeDeck === 'lower'
                      ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Lower Deck (1-20)
                </button>
                <button
                  onClick={() => setActiveDeck('upper')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeDeck === 'upper'
                      ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Upper Deck (21-40)
                </button>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 p-4 bg-gray-50 border-b text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded"></div>
                  <span className="text-gray-600">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 border-2 border-green-600 rounded"></div>
                  <span className="text-gray-600">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-300 border-2 border-gray-400 rounded"></div>
                  <span className="text-gray-600">Booked</span>
                </div>
              </div>

              {/* Seat Layout */}
              <div className="p-6">
                {/* Driver */}
                <div className="flex justify-end mb-4">
                  <div className="bg-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600">
                    🚌 Driver
                  </div>
                </div>

                {/* Seats Grid */}
                <div className="flex justify-center">
                  <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    {/* Group seats by row */}
                    {Array.from({ length: 10 }, (_, rowIdx) => {
                      const rowSeats = displaySeats.filter(s => {
                        const seatNum = parseInt(s.seat_number);
                        const baseNum = activeDeck === 'lower' ? 0 : 20;
                        const relativeNum = seatNum - baseNum;
                        return Math.ceil(relativeNum / 2) === rowIdx + 1;
                      });

                      // Create left-aisle-right layout
                      const leftSeats = rowSeats.slice(0, 1);
                      const rightSeats = rowSeats.slice(1, 2);

                      return (
                        <div key={rowIdx} className="contents">
                          {/* Left seat */}
                          {leftSeats.map(seat => (
                            <button
                              key={seat.id}
                              onClick={() => toggleSeat(seat)}
                              disabled={!seat.is_available}
                              className={getSeatClass(seat)}
                              title={seat.is_available ? `Seat ${seat.seat_number} - ₹${calculatePrice()}` : 'Booked'}
                            >
                              <span className="text-xs font-bold">{seat.seat_number}</span>
                              <span className="text-[10px] opacity-75">
                                {seat.is_available ? `₹${calculatePrice()}` : 'Booked'}
                              </span>
                            </button>
                          ))}
                          {leftSeats.length === 0 && <div className="w-14 h-20"></div>}

                          {/* Aisle */}
                          <div className="w-8 flex items-center justify-center text-gray-300 text-xs">
                            {rowIdx === 4 && '| Aisle |'}
                          </div>

                          {/* Right seats */}
                          {rightSeats.map(seat => (
                            <button
                              key={seat.id}
                              onClick={() => toggleSeat(seat)}
                              disabled={!seat.is_available}
                              className={getSeatClass(seat)}
                              title={seat.is_available ? `Seat ${seat.seat_number} - ₹${calculatePrice()}` : 'Booked'}
                            >
                              <span className="text-xs font-bold">{seat.seat_number}</span>
                              <span className="text-[10px] opacity-75">
                                {seat.is_available ? `₹${calculatePrice()}` : 'Booked'}
                              </span>
                            </button>
                          ))}
                          {rightSeats.length === 0 && <div className="w-14 h-20"></div>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Simple Grid Display (Alternative) */}
                <div className="mt-8 grid grid-cols-5 gap-2 max-w-md mx-auto">
                  {displaySeats.map(seat => (
                    <button
                      key={seat.id}
                      onClick={() => toggleSeat(seat)}
                      disabled={!seat.is_available}
                      className={`${getSeatClass(seat)} !w-full !h-14`}
                      title={seat.is_available ? `Seat ${seat.seat_number} - ₹${calculatePrice()}` : 'Booked'}
                    >
                      <span className="text-xs font-bold">{seat.seat_number}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-600" />
                Selected Seats
              </h3>

              {selectedSeats.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Info className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p>No seats selected</p>
                  <p className="text-sm mt-1">Click on available seats to select</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 mb-4">
                    {selectedSeats.map(seat => (
                      <div key={seat.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <div>
                          <span className="font-medium">Seat {seat.seat_number}</span>
                          <span className="text-xs text-gray-500 ml-2 capitalize">({seat.seat_type})</span>
                        </div>
                        <span className="font-semibold text-green-600">₹{seat.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">Total Fare</span>
                      <span className="text-2xl font-bold text-primary-600">₹{totalFare}</span>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleContinue}
                  disabled={selectedSeats.length === 0}
                  className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
