import React from 'react';
import { FormData } from '../App';
import { HelpCircle } from 'lucide-react';

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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const conferences = [
    'Peninsula Malaysia Mission',
    'Sabah Mission',
    'Sarawak Mission',
    'Singapore Conference',
    'Other'
  ];

  const maxDate = new Date().toISOString().split('T')[0];

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
            <input
              type="text"
              id="country"
              name="country"
              required
              value={formData.country}
              onChange={handleChange}
              className="input-field"
              placeholder="Your country"
            />
          </div>

          <div>
            <label htmlFor="phone" className="form-label">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              placeholder="+60 12 345 6789"
            />
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
              onChange={handleChange}
              className="input-field mt-1"
            >
              <option value="">Select category</option>
              <option value="adult">Adult/Non-Student (RM 210)</option>
              <option value="student">Student (RM 160)</option>
              <option value="ministry-stipend">Ministry Worker - Stipend (RM 170)</option>
              <option value="ministry-salary">Ministry Worker - Salaried (RM 190)</option>
            </select>
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
            onChange={(e) => setFormData(prev => ({ ...prev, volunteer: e.target.checked }))}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label htmlFor="volunteer" className="form-label mb-0">
            I am interested in volunteering during the event
          </label>
        </div>

        <div className="flex justify-between mt-8">
          <button type="button" onClick={onBack} className="btn-secondary">
            Back
          </button>
          <button type="submit" className="btn-primary">
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default ParticipantInfo;