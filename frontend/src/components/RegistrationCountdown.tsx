import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle, Clock } from 'lucide-react';

interface RegistrationCountdownProps {
  onStart: () => void;
}

const RegistrationCountdown: React.FC<RegistrationCountdownProps> = ({ onStart }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Registration closing date: May 5, 2025, 23:59 GMT+8 (Malaysian time)
  const registrationCloseDate = new Date('2025-05-05T23:59:00+08:00');
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = registrationCloseDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        // Registration is closed
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();
    
    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const isRegistrationOpen = new Date() < registrationCloseDate;

  return (
    <div className="animate-fade-in text-center">
      <h2 className="section-title mb-8">AOY 2025 Registration</h2>
      
      {isRegistrationOpen ? (
        <div className="space-y-8">
          <div className="bg-orange-50 dark:bg-gray-700/50 p-8 rounded-lg">
            <div className="flex justify-center items-center mb-6">
              <Clock className="w-12 h-12 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Registration Closing Soon!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Don't miss out! Registration closes on May 5th, 2025 at 11:59 PM (GMT+8)
            </p>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {timeLeft.days}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Days</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {timeLeft.hours}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Hours</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {timeLeft.minutes}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Minutes</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {timeLeft.seconds}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Seconds</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-gray-700/30 p-6 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-1" />
              <div className="text-left">
                <h4 className="font-medium text-blue-700 dark:text-blue-300">
                  Ready to Register?
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-200 mt-1">
                  Click the button below to start your registration for AOY 2025 before time runs out!
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <button onClick={onStart} className="btn-primary">
              Start Registration
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-red-50 dark:bg-red-900/30 p-8 rounded-lg">
            <div className="flex justify-center items-center mb-6">
              <Calendar className="w-12 h-12 text-red-500" />
            </div>            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Registration Has Closed
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              We're sorry, but the registration period for AOY 2025 has ended.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We look forward to seeing all registered participants on June 5th, 2025!
            </p>
            <div className="flex justify-center">
              <div className="inline-block bg-orange-100 dark:bg-orange-900/50 p-4 rounded-lg">
                <p className="text-orange-700 dark:text-orange-300 font-medium">
                  See you on the 5th of June, 2025!
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-gray-700/30 p-6 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-1" />
              <div className="text-left">
                <h4 className="font-medium text-blue-700 dark:text-blue-300">
                  Questions or Concerns?
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-200 mt-1">
                  If you have any questions, please contact us at <a href="mailto:aoyregister.aoy@gmail.com" className="underline">aoyregister.aoy@gmail.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationCountdown;