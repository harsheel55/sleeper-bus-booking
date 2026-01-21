import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Utensils, Plus, Minus, Leaf, Drumstick } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { getMeals } from '../services/api';
import BookingProgress from '../components/BookingProgress';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function MealBookingPage() {
  const navigate = useNavigate();
  const { bookingData, updateBooking } = useBooking();
  
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeals, setSelectedMeals] = useState([]);

  useEffect(() => {
    if (!bookingData.selectedSeats || bookingData.selectedSeats.length === 0) {
      navigate('/select-seats');
      return;
    }
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await getMeals();
      setMeals(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch meals:', error);
      // Fallback meals
      setMeals([
        { id: 1, name: 'Veg Thali', description: 'Dal, Roti, Rice, Sabzi, Pickle', price: 150, type: 'veg', image: '🥗' },
        { id: 2, name: 'Paneer Combo', description: 'Paneer Butter Masala, 2 Roti, Rice', price: 180, type: 'veg', image: '🧀' },
        { id: 3, name: 'Chicken Biryani', description: 'Hyderabadi style with Raita', price: 220, type: 'non-veg', image: '🍗' },
        { id: 4, name: 'Jain Thali', description: 'No onion, no garlic - Pure Jain', price: 160, type: 'jain', image: '🥙' },
        { id: 5, name: 'South Indian Combo', description: '2 Dosa, Sambar, Chutney', price: 140, type: 'veg', image: '🥞' },
        { id: 6, name: 'Sandwich + Juice', description: 'Grilled Veg Sandwich with Fresh Juice', price: 120, type: 'veg', image: '🥪' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateMealQuantity = (meal, delta) => {
    const existing = selectedMeals.find(m => m.id === meal.id);
    
    if (existing) {
      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        setSelectedMeals(selectedMeals.filter(m => m.id !== meal.id));
      } else if (newQty > 10) {
        toast.error('Maximum 10 of each meal');
      } else {
        setSelectedMeals(selectedMeals.map(m => 
          m.id === meal.id ? { ...m, quantity: newQty } : m
        ));
      }
    } else if (delta > 0) {
      setSelectedMeals([...selectedMeals, { ...meal, quantity: 1 }]);
    }
  };

  const getMealQuantity = (mealId) => {
    const meal = selectedMeals.find(m => m.id === mealId);
    return meal ? meal.quantity : 0;
  };

  const handleContinue = () => {
    updateBooking({ selectedMeals });
    navigate('/passenger-details');
  };

  const handleSkip = () => {
    updateBooking({ selectedMeals: [] });
    navigate('/passenger-details');
  };

  const seatsFare = bookingData.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const mealsFare = selectedMeals.reduce((sum, meal) => sum + (meal.price * meal.quantity), 0);
  const totalFare = seatsFare + mealsFare;

  if (loading) {
    return (
      <>
        <BookingProgress />
        <LoadingSpinner text="Loading meal options..." />
      </>
    );
  }

  return (
    <>
      <BookingProgress />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Add Meals to Your Journey
          </h1>
          <p className="text-gray-600">
            Pre-order delicious meals. Delivered at intermediate stations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Meals Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meals.map(meal => {
                const quantity = getMealQuantity(meal.id);
                const isSelected = quantity > 0;

                return (
                  <div
                    key={meal.id}
                    className={`bg-white rounded-xl border-2 p-4 transition-all ${
                      isSelected ? 'border-green-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Meal Image/Icon */}
                      <div className="text-5xl">{meal.image || '🍽️'}</div>
                      
                      {/* Meal Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-gray-900">{meal.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                            meal.type === 'veg' || meal.type === 'jain'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {meal.type === 'veg' || meal.type === 'jain' ? (
                              <Leaf className="w-3 h-3" />
                            ) : (
                              <Drumstick className="w-3 h-3" />
                            )}
                            {meal.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">{meal.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary-600">₹{meal.price}</span>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            {quantity > 0 ? (
                              <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-2">
                                <button
                                  onClick={() => updateMealQuantity(meal, -1)}
                                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-semibold w-6 text-center">{quantity}</span>
                                <button
                                  onClick={() => updateMealQuantity(meal, 1)}
                                  className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => updateMealQuantity(meal, 1)}
                                className="flex items-center gap-1 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-primary-600" />
                Booking Summary
              </h3>

              {/* Seats */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Seats ({bookingData.selectedSeats.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {bookingData.selectedSeats.map(seat => (
                    <span key={seat.id} className="px-2 py-1 bg-gray-100 rounded text-sm">
                      Seat {seat.seat_number}
                    </span>
                  ))}
                </div>
                <p className="text-right text-gray-600 mt-2">₹{seatsFare}</p>
              </div>

              {/* Selected Meals */}
              {selectedMeals.length > 0 && (
                <div className="mb-4 border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Meals</h4>
                  <div className="space-y-2">
                    {selectedMeals.map(meal => (
                      <div key={meal.id} className="flex justify-between text-sm">
                        <span>{meal.name} x{meal.quantity}</span>
                        <span className="text-gray-600">₹{meal.price * meal.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-right text-gray-600 mt-2">₹{mealsFare}</p>
                </div>
              )}

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium text-gray-600">Total Amount</span>
                  <span className="text-2xl font-bold text-primary-600">₹{totalFare}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mt-6">
                <button
                  onClick={handleContinue}
                  className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                >
                  Continue with Meals
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleSkip}
                  className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Skip Meals
                </button>

                <button
                  onClick={() => navigate('/select-seats')}
                  className="w-full py-2 text-gray-500 text-sm hover:text-gray-700 transition-colors flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Seat Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
