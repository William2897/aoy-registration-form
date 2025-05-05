import React, { useState, FormEvent, useEffect } from 'react';
import { Sun, Moon, Loader2 } from 'lucide-react';
import RegistrationCountdown from './components/RegistrationCountdown';
import WelcomeSection from './components/WelcomeSection';
import ParticipantInfo from './components/ParticipantInfo';
import FamilyRegistration from './components/FamilyRegistration';
import TshirtOrder from './components/TshirtOrder';
import HealthInfo from './components/HealthInfo';
import Payment from './components/Payment';
import TermsAndConditions from './components/TermsAndConditions';
import ProgressBar from './components/ProgressBar';
import { OccupationType } from './utils/pricing';

export type FormData = {
  step: number;
  email: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  country: string;
  phone: string;
  occupationType: OccupationType;
  conference: string;
  otherConference: string;
  church: string;
  volunteer: boolean;
  isFoodTeam: boolean;
  isRegistrationTeam: boolean;
  isTreasuryTeam: boolean;
  isPrayerTeam: boolean;
  isPaAvTeam: boolean;
  isEmergencyMedicalTeam: boolean;
  isChildrenProgram: boolean;
  isUsher: boolean;
  hasFamily: boolean;
  familyDetails: Array<{
    fullName: string;
    dateOfBirth: string;
    gender: string;  // Add this line
    foodAllergies: boolean;
    allergiesDetails: string;
    riceType: 'brown' | 'white' | '';
    portionSize: 'small' | 'big' | '';
    healthIssues: boolean;
    healthDetails: string;
    occupationType: OccupationType;
    phone?: string;
    volunteer: boolean;
    isFoodTeam: boolean;
    isRegistrationTeam: boolean;
    isTreasuryTeam: boolean;
    isPrayerTeam: boolean;
    isPaAvTeam: boolean;
    isEmergencyMedicalTeam: boolean;
    isChildrenProgram: boolean;
    isUsher: boolean;
  }>;
  orderTshirt: boolean;
  tshirtOrders: Array<{
    size: string;
    quantity: number;
  }>;
  foodAllergies: boolean;
  allergiesDetails: string;
  riceType: 'brown' | 'white' | '';
  portionSize: 'small' | 'big' | '';
  healthIssues: boolean;
  healthDetails: string;
  paymentMethod: string;
  paymentProof: File | null;
  termsAccepted: boolean;
  walkInCategory?: OccupationType;
};

const initialFormData: FormData = {
  step: 0,
  email: '',
  fullName: '',
  dateOfBirth: '',
  gender: '',
  country: '',
  phone: '',
  occupationType: 'working_adult',
  conference: '',
  otherConference: '',
  church: '',
  volunteer: false,
  isFoodTeam: false,
  isRegistrationTeam: false,
  isTreasuryTeam: false,
  isPrayerTeam: false,
  isPaAvTeam: false,
  isEmergencyMedicalTeam: false,
  isChildrenProgram: false,
  isUsher: false,
  riceType: '',
  portionSize: '',
  foodAllergies: false,
  allergiesDetails: '',
  healthIssues: false,
  healthDetails: '',
  hasFamily: false,
  familyDetails: [],
  orderTshirt: false,
  tshirtOrders: [],
  paymentMethod: '',
  paymentProof: null,
  termsAccepted: false,
  walkInCategory: undefined,
};

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
    // Registration closing date: May 5, 2025, 23:59 GMT+8 (Malaysian time)
  const registrationCloseDate = new Date('2025-05-05T23:59:00+08:00');
  // To test the closed registration page, uncomment the line below
  // const registrationCloseDate = new Date('2025-05-04T23:59:00+08:00'); // Past date for testing
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
    useEffect(() => {
    // Check if registration is still open
    const checkRegistrationStatus = () => {
      const now = new Date();
      // This is the real check for production
      setIsRegistrationOpen(now < registrationCloseDate);
      
      // For testing purposes:
      // Uncomment the line below and comment the line above to test when registration is closed
      // setIsRegistrationOpen(false);
    };
    
    // Check immediately on component mount
    checkRegistrationStatus();
    
    // Set up interval to check every minute
    const intervalId = setInterval(checkRegistrationStatus, 60000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark');
  };

  const handleNext = () => {
    setFormData((prev) => ({ ...prev, step: prev.step + 1 }));
  };

  const handleBack = () => {
    setFormData((prev) => ({ ...prev, step: prev.step - 1 }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSubmitError(null);
    setSubmitSuccess(false);
  };

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitError(null);

  const formDataToSubmit = new FormData();
  formDataToSubmit.append('email', formData.email);
  formDataToSubmit.append('fullName', formData.fullName);
  formDataToSubmit.append('dateOfBirth', formData.dateOfBirth);
  formDataToSubmit.append('gender', formData.gender);
  formDataToSubmit.append('country', formData.country);
  formDataToSubmit.append('phone', formData.phone);
  formDataToSubmit.append('occupationType', formData.occupationType);
  formDataToSubmit.append('conference', formData.conference);
  formDataToSubmit.append('otherConference', formData.otherConference);
  formDataToSubmit.append('church', formData.church);
  formDataToSubmit.append('volunteer', String(formData.volunteer));
  formDataToSubmit.append('isFoodTeam', String(formData.isFoodTeam));
  formDataToSubmit.append('isRegistrationTeam', String(formData.isRegistrationTeam));
  formDataToSubmit.append('isTreasuryTeam', String(formData.isTreasuryTeam));
  formDataToSubmit.append('isPrayerTeam', String(formData.isPrayerTeam));
  formDataToSubmit.append('isPaAvTeam', String(formData.isPaAvTeam));
  formDataToSubmit.append('isEmergencyMedicalTeam', String(formData.isEmergencyMedicalTeam));
  formDataToSubmit.append('isChildrenProgram', String(formData.isChildrenProgram));
  formDataToSubmit.append('isUsher', String(formData.isUsher));
  formDataToSubmit.append('riceType', formData.riceType);
  formDataToSubmit.append('portionSize', formData.portionSize);
  formDataToSubmit.append('foodAllergies', String(formData.foodAllergies));
  formDataToSubmit.append('allergiesDetails', formData.allergiesDetails);
  formDataToSubmit.append('healthIssues', String(formData.healthIssues));
  formDataToSubmit.append('healthDetails', formData.healthDetails);
  formDataToSubmit.append('paymentMethod', formData.paymentMethod);
  formDataToSubmit.append('hasFamily', String(formData.hasFamily));

  if (formData.hasFamily) {
    formData.familyDetails.forEach((child, index) => {
      formDataToSubmit.append(`familyDetails[${index}][volunteer]`, String(child.volunteer));
      formDataToSubmit.append(`familyDetails[${index}][fullName]`, child.fullName);
      formDataToSubmit.append(`familyDetails[${index}][dateOfBirth]`, child.dateOfBirth);
      formDataToSubmit.append(`familyDetails[${index}][gender]`, child.gender)
      formDataToSubmit.append(`familyDetails[${index}][phone]`, child.phone || '');
      formDataToSubmit.append(`familyDetails[${index}][foodAllergies]`, String(child.foodAllergies));
      formDataToSubmit.append(`familyDetails[${index}][allergiesDetails]`, child.allergiesDetails);
      formDataToSubmit.append(`familyDetails[${index}][healthIssues]`, String(child.healthIssues));
      formDataToSubmit.append(`familyDetails[${index}][healthDetails]`, child.healthDetails);
      formDataToSubmit.append(`familyDetails[${index}][riceType]`, child.riceType);
      formDataToSubmit.append(`familyDetails[${index}][portionSize]`, child.portionSize);
      formDataToSubmit.append(`familyDetails[${index}][occupationType]`, child.occupationType);
      formDataToSubmit.append(`familyDetails[${index}][isFoodTeam]`, String(child.isFoodTeam));
      formDataToSubmit.append(`familyDetails[${index}][isRegistrationTeam]`, String(child.isRegistrationTeam));
      formDataToSubmit.append(`familyDetails[${index}][isTreasuryTeam]`, String(child.isTreasuryTeam));
      formDataToSubmit.append(`familyDetails[${index}][isPrayerTeam]`, String(child.isPrayerTeam));
      formDataToSubmit.append(`familyDetails[${index}][isPaAvTeam]`, String(child.isPaAvTeam));
      formDataToSubmit.append(`familyDetails[${index}][isEmergencyMedicalTeam]`, String(child.isEmergencyMedicalTeam));
      formDataToSubmit.append(`familyDetails[${index}][isChildrenProgram]`, String(child.isChildrenProgram));
      formDataToSubmit.append(`familyDetails[${index}][isUsher]`, String(child.isUsher));
    });
  } else {
    formDataToSubmit.append('familyDetails', JSON.stringify([]));
  }

  formDataToSubmit.append('orderTshirt', String(formData.orderTshirt));
  
  
  // Ensure tshirtOrders is always an array

  // Ensure tshirtOrders is always an array
  if (formData.orderTshirt) {
    formData.tshirtOrders.forEach((order, index) => {
      formDataToSubmit.append(`tshirtOrders[${index}][size]`, order.size);
      formDataToSubmit.append(`tshirtOrders[${index}][quantity]`, String(order.quantity));
    });
  } else {
    formDataToSubmit.append('tshirtOrders', JSON.stringify([]));
  }

  if (formData.paymentProof) {
    formDataToSubmit.append('paymentProof', formData.paymentProof);
  }

  formDataToSubmit.append('termsAccepted', String(formData.termsAccepted));

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/registration`, {
      method: 'POST',
      body: formDataToSubmit,
    });

    const formDataObject = Object.fromEntries(formDataToSubmit.entries());
    console.log('Sending form data:', formDataObject);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    console.log('Registration successful:', data);
    setSubmitSuccess(true);
  } catch (error: any) {
    console.error('Registration error:', error);
    setSubmitError(error.message || 'An unexpected error occurred.');
  } finally {
    setIsSubmitting(false);
  }
};
  const stepsComponents: { [key: number]: JSX.Element } = {
    0: isRegistrationOpen ? (
      <WelcomeSection onNext={handleNext} />
    ) : (
      <RegistrationCountdown onStart={handleNext} />
    ),
    1: (
      <ParticipantInfo
        formData={formData}
        setFormData={setFormData}
        onNext={handleNext}
        onBack={handleBack}
      />
    ),
    2: (
      <HealthInfo
        formData={formData}
        setFormData={setFormData}
        onNext={handleNext}
        onBack={handleBack}
      />
    ),
    3: (
      <FamilyRegistration
        formData={formData}
        setFormData={setFormData}
        onNext={handleNext}
        onBack={handleBack}
      />
    ),
    4: (
      <TshirtOrder
        formData={formData}
        setFormData={setFormData}
        onNext={handleNext}
        onBack={handleBack}
      />
    ),
    5: (
      <TermsAndConditions
        formData={formData}
        setFormData={setFormData}
        onNext={handleNext}
        onBack={handleBack}
      />
    ),
    6: (
      <Payment
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onBack={handleBack}
      />
    ),
  };

  const renderStep = () => {
    if (submitSuccess) {
      return (
        <div className="text-center py-8">
          <div className="bg-green-50 dark:bg-green-900/50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
              Registration Successful!
            </h2>
            <p className="text-green-700 dark:text-green-300 mb-6">
              Thank you for registering for AOY 2025. Please check your email for confirmation details.
            </p>
            <button
              onClick={resetForm}
              className="btn-primary bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
            >
              Register Another Person
            </button>
          </div>
        </div>
      );
    }

    return stepsComponents[formData.step] || null;
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              AOY 2025 Registration
            </h1>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-orange-100 dark:bg-gray-700 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>

          {submitError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg">
              <p className="font-medium">Registration Error</p>
              <p className="text-sm">{submitError}</p>
            </div>
          )}

          {isSubmitting && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl flex items-center space-x-4">
                <Loader2 className="w-6 h-6 text-orange-600 dark:text-orange-400 animate-spin" />
                <p className="text-gray-900 dark:text-gray-100">Submitting registration...</p>
              </div>
            </div>
          )}

          {!submitSuccess && <ProgressBar currentStep={formData.step} totalSteps={7} />}

          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default App;
