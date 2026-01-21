import { Check, Circle, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const steps = [
  { path: '/', label: 'Search' },
  { path: '/select-seats', label: 'Select Seats' },
  { path: '/add-meals', label: 'Add Meals' },
  { path: '/passenger-details', label: 'Passenger Info' },
  { path: '/confirmation', label: 'Confirmation' }
];

export default function BookingProgress() {
  const location = useLocation();
  
  const getCurrentStep = () => {
    const idx = steps.findIndex(s => location.pathname.startsWith(s.path.split('/')[1] ? '/' + s.path.split('/')[1] : s.path));
    return idx >= 0 ? idx : 0;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-center overflow-x-auto">
          {steps.map((step, index) => (
            <div key={step.path} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`ml-2 text-sm font-medium hidden sm:block ${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="w-5 h-5 mx-2 text-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
