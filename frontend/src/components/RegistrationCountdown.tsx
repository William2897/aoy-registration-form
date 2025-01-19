import React, { useState, useEffect } from 'react';
import {Calendar, AlertCircle } from 'lucide-react';

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

  const registrationStartDate = new Date('2025-02-03T00:00:00Z');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = registrationStartDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        // Registration is open
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();
    
    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const isRegistrationOpen = new Date() >= registrationStartDate;

  return (
    <div className="animate-fade-in text-center">
      <h2 className="section-title mb-8">AOY 2025 Registration</h2>
      
      {!isRegistrationOpen ? (
        <div className="space-y-8">
          <div className="bg-orange-50 dark:bg-gray-700/50 p-8 rounded-lg">
            <div className="flex justify-center items-center mb-6">
              <Calendar className="w-12 h-12 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Registration Opens Soon!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Mark your calendar for February 3rd, 2025
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
                  Early Bird Special
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-200 mt-1">
                  Register early to get RM20 off! Special discount available until January 31st, 2025.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <button onClick={onStart} className="btn-primary">
            Start Registration
          </button>
        </div>
      )}
    </div>
  );
};

export default RegistrationCountdown;