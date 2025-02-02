import React, { useState } from 'react';
import Select from 'react-select';
import PhoneInput from 'react-phone-input-2';
import { countries } from 'countries-list';
import 'react-phone-input-2/lib/style.css';
import { FormData } from '../App';
import { HelpCircle } from 'lucide-react';
import { isWalkInPeriod, OccupationType } from '../utils/pricing';
import VolunteerSelection from './VolunteerSelection';

// Add this type definition
type CountryOption = {
  value: string;
  label: string;
};

interface ParticipantInfoProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  onBack: () => void;
}

const ParticipantInfo: React.FC<ParticipantInfoProps> = ({
  formData,
  setFormData,
  onNext,
  onBack,
}) => {
  const [walkInError, setWalkInError] = useState<string>('');
  const [volunteerError, setVolunteerError] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');

  const hasSelectedVolunteerRoles = (data: FormData): boolean => {
    return (
      data.isFoodTeam ||
      data.isRegistrationTeam ||
      data.isTreasuryTeam ||
      data.isPrayerTeam ||
      data.isPaAvTeam ||
      data.isEmergencyMedicalTeam ||
      data.isChildrenProgram ||
      data.isUsher
    );
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    if ((formData.occupationType === 'walk_in_full' || formData.occupationType === 'walk_in_partial') && !isWalkInPeriod()) {
      return false;
    }
    if (formData.volunteer && !hasSelectedVolunteerRoles(formData)) {
      return false;
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOccupationTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as OccupationType;
    
    if ((value === 'walk_in_full' || value === 'walk_in_partial') && !isWalkInPeriod()) {
      setWalkInError('Walk-in registration is only available from 05/06/2025 to 08/06/2025.');
    } else {
      setWalkInError('');
    }
    
    setFormData(prev => ({
      ...prev,
      occupationType: value,
      walkInCategory: value === 'walk_in_full' ? prev.walkInCategory : undefined
    }));
  };

  // Add phone validation function
  const validatePhone = (phone: string): boolean => {
    // Remove any spaces, dashes, or parentheses
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    // Check if the number has at least 8 digits (excluding country code)
    return cleanPhone.length >= 9;
  };

  const handleVolunteerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      volunteer: e.target.checked,
      // Reset all volunteer role fields when unchecking volunteer
      ...(e.target.checked ? {} : {
        isFoodTeam: false,
        isRegistrationTeam: false,
        isTreasuryTeam: false,
        isPrayerTeam: false,
        isPaAvTeam: false,
        isEmergencyMedicalTeam: false,
        isChildrenProgram: false,
        isUsher: false,
      })
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number
    if (!formData.phone || !validatePhone(formData.phone)) {
      setPhoneError('Please enter a valid phone number');
      return;
    }
    setPhoneError('');

    // Update volunteer validation
    if (formData.volunteer && !hasSelectedVolunteerRoles(formData)) {
      setVolunteerError('Please select at least one volunteer role to continue.');
      return;
    }
    setVolunteerError('');
    
    if (isFormValid()) {
      onNext();
    }
  };

  const conferences = [
    'Peninsular Malaysia Mission',
    'Sabah Mission',
    'Sarawak Mission',
    'Singapore Conference',
    'Other'
  ];

  const maxDate = new Date().toISOString().split('T')[0];

  // Convert countries object to array of options for react-select
  const countryOptions: CountryOption[] = Object.entries(countries).map(([, country]) => ({
    value: country.name,
    label: country.name
  })).sort((a, b) => a.label.localeCompare(b.label));

  // Find selected country option
  const selectedCountry = countryOptions.find(option => option.value === formData.country);

  return (
    <div className="animate-fade-in">
      <h2 className="section-title">Personal Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="form-label">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="fullName" className="form-label">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="input-field"
              placeholder="As per ID/Passport"
            />
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="form-label">Date of Birth *</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              required
              max={maxDate}
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="input-field"
            />
          </div>

              <div>
              <label className="form-label">Gender *</label>
              <div className="flex space-x-4 mt-4">
                <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleChange}
                  className="text-orange-600 focus:ring-orange-500"
                  required
                />
                <span>Male</span>
                </label>
                <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                  className="text-orange-600 focus:ring-orange-500"
                  required
                />
                <span>Female</span>
                </label>
              </div>
              </div>

          <div>
            <label htmlFor="country" className="form-label">Country of Residence *</label>
            <Select
              id="country"
              name="country"
              value={selectedCountry}
              onChange={(option) => {
                setFormData(prev => ({
                  ...prev,
                  country: option?.value || ''
                }));
              }}
              options={countryOptions}
              className="react-select-container"
              classNamePrefix="react-select"
              isSearchable
              required
              placeholder="Select your country"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: '#e5e7eb',
                  '&:hover': {
                    borderColor: '#d1d5db'
                  }
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 50
                })
              }}
            />
          </div>

          <div>
            <label htmlFor="phone" className="form-label">Phone Number *</label>
            <PhoneInput
              country={'my'} // Default to Malaysia
              value={formData.phone}
              onChange={(phone) => {
                  setFormData(prev => ({
                    ...prev,
                    phone
                  }));
                  // Clear error when user types
                  setPhoneError('');
              }}
              inputClass="w-full px-4 py-2 border rounded"
              containerClass="phone-input-container"
              buttonClass="phone-input-button"
              dropdownClass="phone-input-dropdown"
              enableSearch
              countryCodeEditable={false}
              inputProps={{
                  id: 'phone',
                  name: 'phone',
                  required: true,
              }}
              isValid={(value) => {
                  return validatePhone(value);
              }}
            />

            {phoneError && (
              <p className="text-red-500 text-sm mt-1">{phoneError}</p>
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <label htmlFor="occupationType" className="form-label mb-0">
                Ocupation Type *
              </label>
              <div className="group relative">
                <HelpCircle className="w-4 h-4 text-gray-400" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-64 text-center">
                  Select your registration category. Different rates apply based on your status.
                </div>
              </div>
            </div>
            <select
              id="occupationType"
              name="occupationType"
              required
              value={formData.occupationType}
              onChange={handleOccupationTypeChange}
              className="input-field mt-1"
            >
              <option value="">Select category</option>
              <option value="adult">Adult (RM 240)</option>
              <option value="student">Student (RM 180)</option>
              <option value="ministry_salary">Ministry Worker - Salaried (RM 240)</option>
              <option value="ministry_stipend">Ministry Worker - Stipend (RM 180)</option>
              <option value="walk_in_full">Walk-in (Full Conference)</option>
              <option value="walk_in_partial">Walk-in (Partial Conference) - RM 100/day</option>
            </select>
            {walkInError && (
              <p className="text-red-500 text-sm mt-1">{walkInError}</p>
            )}

            {formData.occupationType === 'walk_in_full' && (
              <div className="mt-4">
                <label htmlFor="walkInCategory" className="form-label">
                  Category for Full Conference
                </label>
                <select
                  id="walkInCategory"
                  name="walkInCategory"
                  required
                  value={formData.walkInCategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, walkInCategory: e.target.value as OccupationType }))}
                  className="input-field mt-1"
                >
                  <option value="">Select category</option>
                  <option value="adult">Adult (RM 240)</option>
                  <option value="student">Student (RM 180)</option>
                  <option value="ministry_salary">Ministry Worker - Salaried (RM 240)</option>
                  <option value="ministry_stipend">Ministry Worker - Stipend (RM 180)</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="conference" className="form-label">Conference/Mission *</label>
            <select
              id="conference"
              name="conference"
              required
              value={formData.conference}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select conference</option>
              {conferences.map(conf => (
                <option key={conf} value={conf}>{conf}</option>
              ))}
            </select>
          </div>
        </div>

        {formData.conference === 'Other' && (
          <div>
            <label htmlFor="otherConference" className="form-label">Specify Conference/Mission *</label>
            <input
              type="text"
              id="otherConference"
              name="otherConference"
              required
              value={formData.otherConference}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your conference/mission"
            />
          </div>
        )}

        <div>
          <label htmlFor="church" className="form-label">Church Currently Attending (Full Name) *</label>
          <input
            type="text"
            id="church"
            name="church"
            required
            value={formData.church}
            onChange={handleChange}
            className="input-field"
            placeholder="Your local church"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="volunteer"
            name="volunteer"
            checked={formData.volunteer}
            onChange={handleVolunteerChange}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label htmlFor="volunteer" className="form-label mb-0">
            I am interested in volunteering during the event
          </label>
        </div>
        {volunteerError && (
          <p className="text-red-500 text-sm mt-1">{volunteerError}</p>
        )}

        <VolunteerSelection formData={formData} setFormData={setFormData} />

        <div className="flex justify-between mt-8">
          <button type="button" onClick={onBack} className="btn-secondary">
            Back
          </button>
          <button 
            type="submit" 
            className={`btn-primary ${!isFormValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isFormValid()}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default ParticipantInfo;