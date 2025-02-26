import React from 'react';
import {Calendar, Mail, CreditCard, MapPin } from 'lucide-react';

interface WelcomeSectionProps {
  onNext: () => void;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onNext }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="section-title">Welcome to AOY 2025!</h2>
      
      <div className="space-y-6">
        <div className="bg-orange-50 dark:bg-gray-700 rounded-lg p-6">
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

        <div className="bg-green-50 dark:bg-gray-700/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4">
            Early Bird Special!
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Get <strong>RM20 off</strong> when you register early! Limited time offer ends <strong>2nd March, 2025</strong>.
          </p>
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