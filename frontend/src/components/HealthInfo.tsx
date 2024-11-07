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