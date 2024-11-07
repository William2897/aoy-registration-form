import React, { useState } from 'react';
import { FormData } from '../App';
import { Plus, Trash2 } from 'lucide-react';

interface KidsRegistrationProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  onBack: () => void;
}

const KidsRegistration: React.FC<KidsRegistrationProps> = ({
  formData,
  setFormData,
  onNext,
  onBack,
}) => {
  const [, setShowError] = useState(false);
  const maxDate = new Date().toISOString().split('T')[0];

  const addChild = () => {
    setFormData(prev => ({
      ...prev,
      kidsDetails: [
        ...prev.kidsDetails,
        { fullName: '', dateOfBirth: '', healthInfo: '' }
      ]
    }));
  };

  const removeChild = (index: number) => {
    setFormData(prev => ({
      ...prev,
      kidsDetails: prev.kidsDetails.filter((_, i) => i !== index)
    }));
  };

  const updateChild = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      kidsDetails: prev.kidsDetails.map((child, i) =>
        i === index ? { ...child, [field]: value } : child
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate dates before proceeding
    const hasInvalidDates = formData.kidsDetails.some(child => {
      const dob = new Date(child.dateOfBirth);
      return dob > new Date();
    });

    if (hasInvalidDates) {
      alert('Please ensure all dates of birth are not in the future.');
      return;
    }
    onNext();
  };

  return (
    <div className="animate-fade-in">
      <h2 className="section-title">Children Registration</h2>
      <p className="section-subtitle">Register children aged 5-12 years old <strong>(RM50 per Child)</strong></p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-2 mb-6">
          <input
            type="checkbox"
            id="hasKids"
            checked={formData.hasKids}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                hasKids: e.target.checked,
                kidsDetails: e.target.checked ? prev.kidsDetails : []
              }));
              setShowError(e.target.checked && formData.kidsDetails.length === 0);
            }}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label htmlFor="hasKids" className="form-label mb-0">
            I have children aged 5-12 to register
          </label>
        </div>

        {formData.hasKids && formData.kidsDetails.length === 0 && (
          <p className="text-red-500">Please add at least one child.</p>
        )}

        {formData.hasKids && (
          <div className="space-y-6">
            {formData.kidsDetails.map((child, index) => (
              <div
                key={index}
                className="bg-orange-50 dark:bg-gray-700/50 p-6 rounded-lg relative animate-slide-up"
              >
                <button
                  type="button"
                  onClick={() => removeChild(index)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                  <Trash2 size={20} />
                </button>

                <h3 className="text-lg font-semibold mb-4">Child {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={child.fullName}
                      onChange={(e) => updateChild(index, 'fullName', e.target.value)}
                      className="input-field"
                      placeholder="Child's full name"
                    />
                  </div>

                  <div>
                    <label className="form-label">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      max={maxDate}
                      value={child.dateOfBirth}
                      onChange={(e) => updateChild(index, 'dateOfBirth', e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="form-label">Health Information</label>
                    <textarea
                      value={child.healthInfo}
                      onChange={(e) => updateChild(index, 'healthInfo', e.target.value)}
                      className="input-field"
                      placeholder="Any allergies, health concerns, or special needs"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addChild}
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors duration-200"
            >
              <Plus size={20} />
              <span>Add Child {formData.kidsDetails.length + 1}</span>
            </button>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button type="button" onClick={onBack} className="btn-secondary">
            Back
          </button>
          <button type="submit" className="btn-primary" disabled={formData.hasKids && formData.kidsDetails.length === 0}>
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default KidsRegistration;