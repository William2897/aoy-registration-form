import React from 'react';
import { FormData } from '../App';
import { AlertCircle } from 'lucide-react';

interface HealthInfoProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  onBack: () => void;
}

const HealthInfo: React.FC<HealthInfoProps> = ({
  formData,
  setFormData,
  onNext,
  onBack,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="animate-fade-in">
      <h2 className="section-title">Health Information</h2>
      
      <div className="bg-blue-50 dark:bg-gray-700/50 p-4 rounded-lg mb-6 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
        <div>
          <p className="text-blue-700 dark:text-blue-300 font-medium">Important Notice</p>
          <p className="text-blue-600 dark:text-blue-200 text-sm">
        Vegan food will be served throughout the event. Please let us know about any allergies or health concerns.
          </p>
          <br />
          <p className="text-blue-600 dark:text-blue-200 text-sm">
          The AOY team will strive to provide suitable options to accommodate participants with dietary restrictions and food allergies. However, please be advised that we cannot guarantee that any food is 100% free of any specific allergen. Participants with severe allergies or specific dietary concerns should take caution.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Food Preferences Section */}
        <div className="bg-white dark:bg-gray-700/30 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Food Preferences</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Please select your food preferences below for the base and portion size to help us minimise food waste:
          </p>
          
          <div className="space-y-6">
            <div>
              <label className="form-label">Rice Type *</label>
              <div className="flex space-x-4 mt-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="riceType"
                    value="brown"
                    checked={formData.riceType === 'brown'}
                    onChange={handleChange}
                    className="text-orange-600 focus:ring-orange-500"
                    required
                  />
                  <span>Brown Rice</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="riceType"
                    value="white"
                    checked={formData.riceType === 'white'}
                    onChange={handleChange}
                    className="text-orange-600 focus:ring-orange-500"
                    required
                  />
                  <span>White Rice</span>
                </label>
              </div>
            </div>

            <div>
              <label className="form-label">Portion Size *</label>
              <div className="flex space-x-4 mt-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="portionSize"
                    value="small"
                    checked={formData.portionSize === 'small'}
                    onChange={handleChange}
                    className="text-orange-600 focus:ring-orange-500"
                    required
                  />
                  <span>Small Portion</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="portionSize"
                    value="big"
                    checked={formData.portionSize === 'big'}
                    onChange={handleChange}
                    className="text-orange-600 focus:ring-orange-500"
                    required
                  />
                  <span>Big Portion</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="foodAllergies"
                checked={formData.foodAllergies}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  foodAllergies: e.target.checked,
                  allergiesDetails: e.target.checked ? prev.allergiesDetails : ''
                }))}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="foodAllergies" className="form-label mb-0">
                I have food allergies
              </label>
            </div>

            {formData.foodAllergies && (
              <div className="animate-slide-up">
                <textarea
                  id="allergiesDetails"
                  value={formData.allergiesDetails}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    allergiesDetails: e.target.value
                  }))}
                  className="input-field"
                  placeholder="Please specify your food allergies"
                  rows={3}
                  required
                />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="healthIssues"
                checked={formData.healthIssues}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  healthIssues: e.target.checked,
                  healthDetails: e.target.checked ? prev.healthDetails : ''
                }))}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="healthIssues" className="form-label mb-0">
                I have health issues or concerns
              </label>
            </div>

            {formData.healthIssues && (
              <div className="animate-slide-up">
                <textarea
                  id="healthDetails"
                  value={formData.healthDetails}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    healthDetails: e.target.value
                  }))}
                  className="input-field"
                  placeholder="Please specify your health issues or concerns"
                  rows={3}
                  required
                />
              </div>
            )}
          </div>
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

export default HealthInfo;