import React from 'react';
import { FormData } from '../App';
import { CheckCircle2 } from 'lucide-react';
import { calculateTotalPrice } from '../utils/pricing';

interface TermsAndConditionsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  formData,
  setFormData,
  onSubmit,
  onBack,
}) => {
  const pricing = calculateTotalPrice(formData);

  const terms = [
    {
      title: 'No Refunds Policy',
      content: 'All registration fees are non-refundable once payment is processed.'
    },
    {
      title: 'Receipt Requirements',
      content: 'Only official bank receipts are accepted as proof of payment. Screenshots or photos of transactions are acceptable.'
    },
    {
      title: 'Payment for Overseas Participants',
      content: 'Overseas participants are encouraged to pay in cash on-site or via online transfer.'
    },
    {
      title: 'Payment Confirmation',
      content: 'All participants must confirm their payment after registration. For payment inquiries, please contact registration@aoy2025.com'
    },
    {
      title: 'Registration Policy',
      content: 'One registration form per participant. Each participant must register individually.'
    }
  ];

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
            <p><strong>Name:</strong> {formData.fullName}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Phone:</strong> {formData.phone}</p>
            <p><strong>Registration Category:</strong> {formData.occupationType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
            {formData.hasKids && (
              <p><strong>Children Registered:</strong> {formData.kidsDetails.length}</p>
            )}
            {formData.orderTshirt && (
              <p><strong>T-shirts Ordered:</strong> {formData.tshirtOrders.reduce((sum, order) => sum + order.quantity, 0)}</p>
            )}
            <p><strong>Payment Method:</strong> {formData.paymentMethod === 'bank' ? 'Bank Transfer' : 'Pay On-site'}</p>
            
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-semibold mb-2">Fee Breakdown</h4>
              <div className="space-y-1">
                <p>Base Registration: RM {pricing.basePrice.toFixed(2)}</p>
                {formData.hasKids && (
                  <p>Child Registration: RM {pricing.kidsTotal.toFixed(2)}</p>
                )}

                {formData.orderTshirt && (
                  <p>T-shirts: RM {pricing.tshirtTotal.toFixed(2)}</p>
                )}
                
                <p>Subtotal: RM {pricing.subtotal.toFixed(2)}</p>
                <p className="text-green-600 dark:text-green-400">Early Bird Discount: -RM {pricing.discount.toFixed(2)}</p>

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
            type="submit"
            onClick={onSubmit}
            disabled={!formData.termsAccepted}
            className="btn-primary"
          >
            Complete Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;