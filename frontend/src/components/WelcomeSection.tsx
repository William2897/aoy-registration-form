import React, { useState, useEffect } from 'react';
import {Calendar, Mail, CreditCard, MapPin, Clock } from 'lucide-react';

interface WelcomeSectionProps {
  onNext: () => void;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onNext }) => {  // Add state for countdown
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
  });
  const [registrationTimeLeft, setRegistrationTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Early bird end date from the pricing utility (March 16th , 2025, 23:59 GMT+8)
  const earlyBirdEndDate = new Date('2025-03-16T23:59:00+08:00');
  
  // Registration closing date: May 5th, 2025, 23:59 GMT+8
  const registrationCloseDate = new Date('2025-05-05T23:59:00+08:00');
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const earlyBirdDifference = earlyBirdEndDate.getTime() - now.getTime();
      const registrationDifference = registrationCloseDate.getTime() - now.getTime();

      if (earlyBirdDifference > 0) {
        setTimeLeft({
          days: Math.floor(earlyBirdDifference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((earlyBirdDifference / (1000 * 60 * 60)) % 24),
        });
      } else {
        // Early bird period has ended
        setTimeLeft({ days: 0, hours: 0 });
      }
      
      if (registrationDifference > 0) {
        setRegistrationTimeLeft({
          days: Math.floor(registrationDifference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((registrationDifference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((registrationDifference / (1000 * 60)) % 60),
          seconds: Math.floor((registrationDifference / 1000) % 60)
        });
      } else {
        // Registration has ended
        setRegistrationTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();
    
    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const isEarlyBirdActive = new Date() <= earlyBirdEndDate;

  return (
    <div className="animate-fade-in">
      <h2 className="section-title">Welcome to AOY 2025!</h2>
      
      <div className="space-y-6">        <div className="bg-orange-50 dark:bg-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-orange-600 dark:text-orange-400 mb-4">
            Event Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-orange-500 mt-1" />
              <div>
                <h4 className="font-medium">Date</h4>
                <p className="text-gray-600 dark:text-gray-300"> 5-8 June, 2025</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-orange-500 mt-1" />
              <div>
                <h4 className="font-medium">Location</h4>
                <p className="text-gray-600 dark:text-gray-300">Rainbow Paradise Beach Resort, Penang, Malaysia</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-gray-700/70 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
            Registration Closing Soon!
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            Don't miss out! Registration closes on <strong>May 5th, 2025</strong> at 11:59 PM (GMT+8)
          </p>
          
          <div className="mt-4 p-3 border border-red-200 dark:border-red-800 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="font-medium text-red-600 dark:text-red-400">Registration Closes In:</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center max-w-[400px] mx-auto">
              <div className="bg-white dark:bg-gray-700 p-2 rounded">
                <div className="text-xl font-bold text-red-600 dark:text-red-400">{registrationTimeLeft.days}</div>
                <div className="text-xs text-red-700 dark:text-red-300">Days</div>
              </div>
              <div className="bg-white dark:bg-gray-700 p-2 rounded">
                <div className="text-xl font-bold text-red-600 dark:text-red-400">{registrationTimeLeft.hours}</div>
                <div className="text-xs text-red-700 dark:text-red-300">Hours</div>
              </div>
              <div className="bg-white dark:bg-gray-700 p-2 rounded">
                <div className="text-xl font-bold text-red-600 dark:text-red-400">{registrationTimeLeft.minutes}</div>
                <div className="text-xs text-red-700 dark:text-red-300">Minutes</div>
              </div>
              <div className="bg-white dark:bg-gray-700 p-2 rounded">
                <div className="text-xl font-bold text-red-600 dark:text-red-400">{registrationTimeLeft.seconds}</div>
                <div className="text-xs text-red-700 dark:text-red-300">Seconds</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-gray-700/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4">
            Early Bird Special Extended!
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Get <strong>RM20 off</strong> when you register early! Limited time offer ends <strong>16th March, 2025</strong>.
          </p>   
            {isEarlyBirdActive && (
            <div className="mt-4 p-3 border border-green-200 dark:border-green-800 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <div className="flex items-center justify-center mb-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="font-medium text-green-600 dark:text-green-400">Early Bird Ends In:</span>
              </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center max-w-[200px] mx-auto">
              <div className="bg-white dark:bg-gray-700 p-2 rounded">
                <div className="text-xl font-bold text-green-600 dark:text-green-400">{timeLeft.days}</div>
                <div className="text-xs text-green-700 dark:text-green-300">Days</div>
              </div>
              <div className="bg-white dark:bg-gray-700 p-2 rounded">
                <div className="text-xl font-bold text-green-600 dark:text-green-400">{timeLeft.hours}</div>
                <div className="text-xs text-green-700 dark:text-green-300">hours</div>
              </div>
              </div>
            </div>
            )}
          <p className="text-gray-700 dark:text-gray-300">
            Get <strong>5% off</strong> when you register your family!
          </p>
          <div className="mt-4 flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-green-500" />
            <span className="text-green-600 dark:text-green-400 font-medium">
            Conference Shirt Price: RM30/piece
            </span>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-gray-700/30 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
            Important Information
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Early bird discount only applies if both <strong>registration and payment</strong> are completed before 2 March 2025</li>
            <li>A <strong>parent</strong> must register at least 2 additional <strong>immediate family</strong> members to qualify for the family package discount.</li>
            <li>Children below 4 years old: Free admission, but not eligible for early bird special.</li>
            <li>Volunteering opportunities are limited to a maximum of 5 roles per participant.</li>
            <li>Provide valid proof of payment if selecting Bank Transfer as the payment method.</li>
          </ul>
        </div>

        <div className="bg-purple-50 dark:bg-gray-700/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
            Need Help?
          </h3>
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-purple-500" />
            <a
              href="mailto:aoyregister.aoy@gmail.com"
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              aoyregister.aoy@gmail.com
            </a>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={onNext}
            className="btn-primary"
          >
            Start Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;