import React, { useState } from 'react';
import { FormData } from '../App';
import { Plus, Trash2 } from 'lucide-react';
import { validateOccupationTypeByAge, getOccupationTypesByAge, FAMILY_OCCUPATION_TYPES, OccupationType } from '../utils/pricing';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import VolunteerSelection from './VolunteerSelection';

interface FamilyRegistrationProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  onBack: () => void;
}

const FamilyRegistration: React.FC<FamilyRegistrationProps> = ({
  formData,
  setFormData,
  onNext,
  onBack,
}) => {
  const [, setShowError] = useState(false);
  const maxDate = new Date().toISOString().split('T')[0];

  // Add minimum family members requirement
  const MIN_FAMILY_MEMBERS = 2;
  const hasMinimumMembers = formData.familyDetails.length >= MIN_FAMILY_MEMBERS;

  // Add phone validation function
  const validatePhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return cleanPhone.length >= 9;
  };

  const addFamilyMember = () => {
    setFormData(prev => ({
      ...prev,
      familyDetails: [
        ...prev.familyDetails,
        {
          fullName: '',
          dateOfBirth: '',
          gender: '', // Add this line
          foodAllergies: false,
          allergiesDetails: '',
          healthIssues: false,
          healthDetails: '',
          riceType: '',
          portionSize: '',
          occupationType: 'working_adult', // Set a default value that matches OccupationType
          phone: '', // Add this field
          volunteer: false,
          isFoodTeam: false,
          isRegistrationTeam: false,
          isTreasuryTeam: false,
          isPrayerTeam: false,
          isPaAvTeam: false,
          isEmergencyMedicalTeam: false,
          isChildrenProgram: false,
          isUsher: false,
        }
      ]
    }));
  };

  const removeFamilyMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      familyDetails: prev.familyDetails.filter((_, i) => i !== index)
    }));
  };

  const updateFamilyMember = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      familyDetails: prev.familyDetails.map((member, i) => {
        if (i !== index) return member;

        const updatedMember = { ...member, [field]: value };

        // If updating date of birth, validate occupation type
        if (field === 'dateOfBirth' && updatedMember.occupationType) {
          const isValid = validateOccupationTypeByAge(value, updatedMember.occupationType);
          if (!isValid) {
            // Reset occupation type if it's no longer valid for the new age
            updatedMember.occupationType = 'working_adult' as OccupationType; // Set a valid default
            alert('Occupation type has been reset due to age change.');
          }
        }

        // If updating occupation type, validate against date of birth
        if (field === 'occupationType' && updatedMember.dateOfBirth) {
          const isValid = validateOccupationTypeByAge(updatedMember.dateOfBirth, value as OccupationType);
          if (!isValid) {
            alert('Selected occupation type is not valid for this age group.');
            return member; // Return original member without updates
          }
        }

        return updatedMember;
      })
    }));
  };

  const getAvailableOccupationTypes = (dateOfBirth: string) => {
    if (!dateOfBirth) return FAMILY_OCCUPATION_TYPES;
    
    const validTypes = getOccupationTypesByAge(dateOfBirth);
    return FAMILY_OCCUPATION_TYPES.filter(type => 
      validTypes.includes(type.type as OccupationType)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check minimum family members requirement if family registration is enabled
    if (formData.hasFamily && !hasMinimumMembers) {
      alert(`Please register at least ${MIN_FAMILY_MEMBERS} family members to qualify for the Family Package.`);
      return;
    }

    // Validate dates before proceeding
    const hasInvalidDates = formData.familyDetails.some(member => {
      const dob = new Date(member.dateOfBirth);
      return dob > new Date();
    });

    if (hasInvalidDates) {
      alert('Please ensure all dates of birth are not in the future.');
      return;
    }

    // Additional validation for required fields if needed
    const hasIncompleteMembers = formData.familyDetails.some(member => 
      !member.fullName || 
      !member.dateOfBirth || 
      !member.riceType || 
      !member.portionSize ||
      !member.occupationType
    );

    if (hasIncompleteMembers) {
      alert('Please complete all required fields for each family member.');
      return;
    }

    onNext();
  };

  return (
    <div className="animate-fade-in">
      <h2 className="section-title">Family Registration</h2>
      <p className="section-subtitle mb-2">Register your family members</p>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        <p className="mb-2">
          <strong>Family Package Eligibility Requirements:</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1">
            <li>Only for immediate family members (parent(s) and their children)</li>
          <li>Minimum {MIN_FAMILY_MEMBERS} family members required</li>
          <li>Other relatives (siblings, cousins, etc.) must register separately</li>
        </ul>
        <p className="mt-2">Pricing varies based on each member's age category.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-2 mb-6">
          <input
            type="checkbox"
            id="hasFamily"
            checked={formData.hasFamily}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                hasFamily: e.target.checked,
                familyDetails: e.target.checked ? prev.familyDetails : []
              }));
              setShowError(e.target.checked && formData.familyDetails.length === 0);
            }}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label htmlFor="hasFamily" className="form-label mb-0">
            I want to register family members
          </label>
        </div>

        {formData.hasFamily && (
          <>
            {formData.familyDetails.length === 0 ? (
              <p className="text-red-500">Please add at least {MIN_FAMILY_MEMBERS} family members.</p>
            ) : !hasMinimumMembers && (
              <p className="text-amber-600 dark:text-amber-400">
                You need {MIN_FAMILY_MEMBERS - formData.familyDetails.length} more family member(s) to qualify for the Family Package.
              </p>
            )}

            <div className="space-y-6">
              {formData.familyDetails.map((member, index) => (
                <div
                  key={index}
                  className="bg-orange-50 dark:bg-gray-700/50 p-6 rounded-lg relative animate-slide-up"
                >
                  <button
                    type="button"
                    onClick={() => removeFamilyMember(index)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <Trash2 size={20} />
                  </button>

                  <h3 className="text-lg font-semibold mb-4">Family Member {index + 1}</h3>
                  
                  {/* First Row: Name, DOB, and Gender */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={member.fullName}
                        onChange={(e) => updateFamilyMember(index, 'fullName', e.target.value)}
                        className="input-field"
                        placeholder="Family member's full name"
                      />
                    </div>

                    <div>
                      <label className="form-label">Date of Birth *</label>
                      <input
                        type="date"
                        required
                        max={maxDate}
                        value={member.dateOfBirth}
                        onChange={(e) => updateFamilyMember(index, 'dateOfBirth', e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="form-label">Gender *</label>
                      <div className="flex space-x-4 mt-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            required
                            checked={member.gender === 'male'}
                            onChange={() => updateFamilyMember(index, 'gender', 'male')}
                            className="text-orange-600 focus:ring-orange-500"
                          />
                          <span>Male</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            required
                            checked={member.gender === 'female'}
                            onChange={() => updateFamilyMember(index, 'gender', 'female')}
                            className="text-orange-600 focus:ring-orange-500"
                          />
                          <span>Female</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Second Row: Occupation Type and Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="form-label">Occupation Type *</label>
                      <select
                        required
                        value={member.occupationType}
                        onChange={(e) => updateFamilyMember(index, 'occupationType', e.target.value)}
                        className="input-field"
                        disabled={!member.dateOfBirth}
                      >
                        <option value="">Select occupation type</option>
                        {getAvailableOccupationTypes(member.dateOfBirth).map(({ type, label, price }) => (
                          <option key={type} value={type}>
                            {label} - RM {price}
                          </option>
                        ))}
                      </select>
                    </div>

                    {member.occupationType !== 'child_5_12' && member.occupationType !== 'child_below_4' && (
                      <div>
                        <label htmlFor={`phone-${index}`} className="form-label">Phone Number *</label>
                        <PhoneInput
                          country={'my'}
                          value={member.phone}
                          onChange={(phone) => updateFamilyMember(index, 'phone', phone)}
                          inputClass="w-full px-4 py-2 border rounded"
                          containerClass="phone-input-container"
                          buttonClass="phone-input-button"
                          dropdownClass="phone-input-dropdown"
                          enableSearch
                          countryCodeEditable={false}
                          inputProps={{
                            id: `phone-${index}`,
                            name: `phone-${index}`,
                            required: true,
                          }}
                          isValid={(value) => validatePhone(value)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Add volunteer section before health info */}
                  {member.occupationType !== 'child_5_12' && member.occupationType !== 'child_below_4' && (
                    <div className="mt-6 mb-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`volunteer-${index}`}
                          checked={member.volunteer}
                          onChange={(e) => updateFamilyMember(index, 'volunteer', e.target.checked)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`volunteer-${index}`} className="form-label mb-0">
                          I am interested in volunteering
                        </label>
                      </div>
                      <VolunteerSelection
                        formData={formData}
                        setFormData={setFormData}
                        familyMemberIndex={index}
                      />
                    </div>
                  )}

                  <div className="mt-6">
                    <h4 className="font-semibold text-lg mb-4">Health & Food Preferences</h4>
                    
                    {/* Rice Type and Portion Size in one row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2">
                        <label className="form-label">Rice Type</label>
                        <div className="flex space-x-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              value="brown"
                              checked={member.riceType === 'brown'}
                              onChange={(e) => updateFamilyMember(index, 'riceType', e.target.value)}
                              className="form-radio"
                            />
                            <span className="ml-2">Brown Rice</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              value="white"
                              checked={member.riceType === 'white'}
                              onChange={(e) => updateFamilyMember(index, 'riceType', e.target.value)}
                              className="form-radio"
                            />
                            <span className="ml-2">White Rice</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="form-label">Portion Size</label>
                        <div className="flex space-x-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              value="small"
                              checked={member.portionSize === 'small'}
                              onChange={(e) => updateFamilyMember(index, 'portionSize', e.target.value)}
                              className="form-radio"
                            />
                            <span className="ml-2">Small</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              value="big"
                              checked={member.portionSize === 'big'}
                              onChange={(e) => updateFamilyMember(index, 'portionSize', e.target.value)}
                              className="form-radio"
                            />
                            <span className="ml-2">Big</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Food Allergies and Health Issues remain unchanged */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={member.foodAllergies}
                          onChange={(e) => updateFamilyMember(index, 'foodAllergies', e.target.checked)}
                          className="form-checkbox"
                        />
                        <label className="form-label">Food Allergies</label>
                      </div>
                      {member.foodAllergies && (
                        <textarea
                          value={member.allergiesDetails}
                          onChange={(e) => updateFamilyMember(index, 'allergiesDetails', e.target.value)}
                          className="input-field"
                          placeholder="Please specify any food allergies"
                          rows={2}
                        />
                      )}
                    </div>

                    {/* Health Issues */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={member.healthIssues}
                          onChange={(e) => updateFamilyMember(index, 'healthIssues', e.target.checked)}
                          className="form-checkbox"
                        />
                        <label className="form-label">Health Issues</label>
                      </div>
                      {member.healthIssues && (
                        <textarea
                          value={member.healthDetails}
                          onChange={(e) => updateFamilyMember(index, 'healthDetails', e.target.value)}
                          className="input-field"
                          placeholder="Please specify any health concerns"
                          rows={2}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addFamilyMember}
                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors duration-200"
              >
                <Plus size={20} />
                <span>Add Family Member {formData.familyDetails.length + 1}</span>
              </button>
            </div>
          </>
        )}

        <div className="flex justify-between mt-8">
          <button type="button" onClick={onBack} className="btn-secondary">
            Back
          </button>
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={formData.hasFamily && !hasMinimumMembers}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default FamilyRegistration;