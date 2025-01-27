import React, { useState } from 'react';
import { FormData } from '../App';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { calculateTotalPrice } from '../utils/pricing';

// Remove FamilyMember import and use the type from FormData
type FamilyMember = FormData['familyDetails'][number];

interface TermsAndConditionsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  onBack: () => void;
}

const RegistrantSummary: React.FC<{
  name: string;
  details: {
    dateOfBirth: string;
    occupationType: string;
    volunteer: boolean;
    volunteerRoles: string[];
    riceType: string;
    portionSize: string;
    foodAllergies: boolean;
    allergiesDetails?: string;
    healthIssues: boolean;
    healthDetails?: string;
  };
  isMainRegistrant?: boolean;
}> = ({ name, details, isMainRegistrant }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRole = (role: string) => {
    return role.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="border rounded-lg mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between bg-orange-50 dark:bg-gray-700/50 rounded-lg hover:bg-orange-100 dark:hover:bg-gray-600/50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{name}</span>
          {isMainRegistrant && (
            <span className="text-xs bg-orange-200 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">
              Main Registrant
            </span>
          )}
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      {isOpen && (
        <div className="p-4 space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Date of Birth:</span>
              <p className="font-medium">{formatDate(details.dateOfBirth)}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Category:</span>
              <p className="font-medium">{details.occupationType.split('_').join(' ').toUpperCase()}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Rice Preference:</span>
              <p className="font-medium capitalize">{details.riceType} Rice ({details.portionSize} portion)</p>
            </div>
            {details.volunteer && (
              <div className="col-span-2">
                <span className="text-gray-500 dark:text-gray-400">Volunteer Roles:</span>
                <ul className="list-disc list-inside font-medium">
                  {details.volunteerRoles.map((role, idx) => (
                    <li key={idx}>{formatRole(role)}</li>
                  ))}
                </ul>
              </div>
            )}
            {details.foodAllergies && (
              <div className="col-span-2">
                <span className="text-gray-500 dark:text-gray-400">Food Allergies:</span>
                <p className="font-medium">{details.allergiesDetails}</p>
              </div>
            )}
            {details.healthIssues && (
              <div className="col-span-2">
                <span className="text-gray-500 dark:text-gray-400">Health Issues:</span>
                <p className="font-medium">{details.healthDetails}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  formData,
  setFormData,
  onNext,
  onBack,
}) => {
  const pricing = calculateTotalPrice(formData);

  const terms = [
    {
      title: 'No Refunds',
      content: 'Registration fees are non-refundable once payment is processed.'
    },
    {
      title: 'Receipt Requirements',
      content: 'Only official bank receipts are accepted as proof of payment. Screenshots or transaction photos are allowed.'
    },
    {
      title: 'Overseas Payments',
      content: 'Overseas participants to pay via online transfer or select our deferred payment option.'
    },
    {
      title: 'Substitution Policy',
      content: 'If you cannot attend, contact our registration team to allow another participant to take your spot.'
    },
    {
      title: 'Registration',
      content: 'One registration form per participant. Each must register individually.'
    },
    {
      title: 'Limitation of Liability',
      content: 'Participants release and hold harmless the organisers of AOY Conference 2025 (“AOY”) from any and all claims, demands, losses, damages or liability arising from your participation in the conference. In no event will AOY be liable for any special, indirect or consequential loss.'
    }
  ];

  const handleAgree = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.termsAccepted) {
      onNext();
    }
  };

  const getSelectedVolunteerRoles = (member: FormData | FamilyMember): string[] => {
    const roles: string[] = [];
    if (member.isFoodTeam) roles.push('Food Team');
    if (member.isRegistrationTeam) roles.push('Registration Team');
    if (member.isTreasuryTeam) roles.push('Treasury Team');
    if (member.isPrayerTeam) roles.push('Prayer Team');
    if (member.isPaAvTeam) roles.push('PA/AV Team');
    if (member.isEmergencyMedicalTeam) roles.push('Emergency Medical Team');
    if (member.isChildrenProgram) roles.push('Children\'s Program');
    if (member.isUsher) roles.push('Usher');
    return roles;
  };

  return (
    <div className="animate-fade-in">
      <h2 className="section-title">Terms and Conditions</h2>

      <div className="space-y-6">
        {/* Terms List */}
        <div className="space-y-4">
          {terms.map((term, index) => (
            <div
              key={index}
              className="bg-orange-50 dark:bg-gray-700/50 p-4 rounded-lg"
            >
              <h3 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">
                {term.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {term.content}
              </p>
            </div>
          ))}
        </div>

        {/* Agreement Checkbox */}
        <div className="flex items-start space-x-3 p-4 border rounded-lg bg-green-50 dark:bg-gray-700/30">
          <div className="flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              id="termsAccepted"
              checked={formData.termsAccepted}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                termsAccepted: e.target.checked
              }))}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              required
            />
          </div>
          <label htmlFor="termsAccepted" className="text-sm">
            I have read and agree to the Terms and Conditions. I understand that my registration
            is subject to these terms and that all information provided is accurate.
          </label>
        </div>

        {/* Registration Summary */}
        <div className="bg-white dark:bg-gray-700/30 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span>Registration Summary</span>
          </h3>
          <div className="space-y-3 text-sm">
            <RegistrantSummary
              name={formData.fullName}
              details={{
                dateOfBirth: formData.dateOfBirth,
                occupationType: formData.occupationType,
                volunteer: formData.volunteer,
                volunteerRoles: getSelectedVolunteerRoles(formData),
                riceType: formData.riceType,
                portionSize: formData.portionSize,
                foodAllergies: formData.foodAllergies,
                allergiesDetails: formData.allergiesDetails,
                healthIssues: formData.healthIssues,
                healthDetails: formData.healthDetails,
              }}
              isMainRegistrant
            />

            {/* Family Members Summary */}
            {formData.hasFamily && formData.familyDetails.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Family Members</h4>
                {formData.familyDetails.map((member, index) => (
                  <RegistrantSummary
                    key={index}
                    name={member.fullName}
                    details={{
                      dateOfBirth: member.dateOfBirth,
                      occupationType: member.occupationType,
                      volunteer: member.volunteer,
                      volunteerRoles: getSelectedVolunteerRoles(member),
                      riceType: member.riceType,
                      portionSize: member.portionSize,
                      foodAllergies: member.foodAllergies,
                      allergiesDetails: member.allergiesDetails,
                      healthIssues: member.healthIssues,
                      healthDetails: member.healthDetails,
                    }}
                  />
                ))}
              </div>
            )}
            <p><strong>Payment Method:</strong> {formData.paymentMethod === 'bank' ? 'Bank Transfer' : 'Pay On-site'}</p>
            
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-semibold mb-2">Fee Breakdown</h4>
              <div className="space-y-1">
                <p>Base Registration: RM {pricing.basePrice.toFixed(2)}</p>
                {formData.hasFamily && (
                  <p>Family Registration: RM {pricing.familyTotal.toFixed(2)}</p>
                )}

                {formData.orderTshirt && (
                  <p>T-shirts: RM {pricing.tshirtTotal.toFixed(2)}</p>
                )}
                
                <p>Subtotal: RM {pricing.subtotal.toFixed(2)}</p>
                {pricing.discount > 0 && (
                  <p className="text-green-600 dark:text-green-400">
                    Early Bird Discount: -RM {pricing.discount.toFixed(2)}
                  </p>
                )}
                {pricing.familyDiscount > 0 && (
                  <p className="text-blue-600 dark:text-blue-400">
                    Family Discount (5%): -RM {pricing.familyDiscount.toFixed(2)}
                  </p>
                )}
                <p className="font-bold">Final Total: RM {pricing.finalTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <button type="button" onClick={onBack} className="btn-secondary">
            Back
          </button>
          <button
            type="button"
            onClick={handleAgree}
            disabled={!formData.termsAccepted}
            className="btn-primary"
          >
            I Agree & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;