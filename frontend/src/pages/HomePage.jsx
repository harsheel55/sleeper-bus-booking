import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Calendar, Search, Bus, Clock, Star, Shield, 
  Utensils, Wifi, Snowflake, ChevronRight, ArrowRight
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { getStations } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function HomePage() {
  const navigate = useNavigate();
  const { updateBooking, resetBooking } = useBooking();
  
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fromStation: '',
    toStation: '',
    travelDate: ''
  });

  useEffect(() => {
    resetBooking();
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await getStations();
      setStations(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch stations:', error);
      // Fallback stations
      setStations([
        { id: 1, name: 'Ahmedabad', code: 'AHMD', sequence: 1 },
        { id: 2, name: 'Vadodara', code: 'VDRA', sequence: 2 },
        { id: 3, name: 'Surat', code: 'SURT', sequence: 3 },
        { id: 4, name: 'Mumbai', code: 'MUMB', sequence: 4 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!formData.fromStation || !formData.toStation) {
      toast.error('Please select both stations');
      return;
    }

    if (formData.fromStation === formData.toStation) {
      toast.error('From and To stations cannot be same');
      return;
    }

    const fromStation = stations.find(s => s.id === parseInt(formData.fromStation));
    const toStation = stations.find(s => s.id === parseInt(formData.toStation));

    if (fromStation.sequence >= toStation.sequence) {
      toast.error('Invalid route direction');
      return;
    }

    if (!formData.travelDate) {
      toast.error('Please select travel date');
      return;
    }

    updateBooking({
      fromStation,
      toStation,
      travelDate: formData.travelDate
    });

    navigate('/select-seats');
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get maximum date (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  const features = [
    { icon: Snowflake, title: 'AC Sleeper', desc: 'Fully air-conditioned comfort' },
    { icon: Wifi, title: 'Free WiFi', desc: 'Stay connected throughout' },
    { icon: Utensils, title: 'Meal Service', desc: 'Pre-order delicious meals' },
    { icon: Shield, title: 'Safe Travel', desc: 'Trained drivers & GPS tracking' }
  ];

  const routeInfo = [
    { station: 'Ahmedabad', time: '10:00 PM', km: 0 },
    { station: 'Vadodara', time: '12:30 AM', km: 110 },
    { station: 'Surat', time: '3:00 AM', km: 260 },
    { station: 'Mumbai', time: '7:00 AM', km: 530 }
  ];

  if (loading) {
    return <LoadingSpinner text="Loading..." />;
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Comfortable Sleeper Bus Booking
            </h1>
            <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto">
              Travel overnight in comfort. Premium AC sleeper buses from Ahmedabad to Mumbai.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* From Station */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.fromStation}
                      onChange={(e) => setFormData({ ...formData, fromStation: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                    >
                      <option value="">Select Station</option>
                      {stations.map(station => (
                        <option key={station.id} value={station.id}>
                          {station.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* To Station */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.toStation}
                      onChange={(e) => setFormData({ ...formData, toStation: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                    >
                      <option value="">Select Station</option>
                      {stations.map(station => (
                        <option key={station.id} value={station.id}>
                          {station.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.travelDate}
                      min={getMinDate()}
                      max={getMaxDate()}
                      onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Search Bus
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Why Choose SleeperBus?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 text-primary-600 rounded-xl mb-4">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Route Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Our Route
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
            Overnight journey covering 530 km with convenient stops at major cities
          </p>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary-200 -translate-x-1/2"></div>
              
              {routeInfo.map((stop, idx) => (
                <div key={idx} className={`relative flex items-center mb-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary-600 rounded-full -translate-x-1/2 border-4 border-white shadow"></div>
                  
                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-primary-600" />
                        <span className="font-semibold text-primary-600">{stop.time}</span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900">{stop.station}</h3>
                      <p className="text-sm text-gray-500">{stop.km} km from start</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Book Your Journey?
          </h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Starting from just ₹88 for short routes. Book now and travel in comfort!
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Book Now <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
