import React, { useRef, useState } from 'react';
import { FormData } from '../App';
import { Upload, AlertCircle, CreditCard, Receipt } from 'lucide-react';
import { calculateTotalPrice, checkEarlyBirdEligibility, PRICING_CONFIG } from '../utils/pricing';

interface PaymentProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

const Payment: React.FC<PaymentProps> = ({
  formData,
  setFormData,
  onSubmit,
  onBack,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pricing = calculateTotalPrice(formData);
  const isEarlyBird = checkEarlyBirdEligibility();
  const [paymentError, setPaymentError] = useState<string>('');

  const formatOccupationType = (type: string): string => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png'];
      if (!validImageTypes.includes(file.type)) {
        setPaymentError('Please upload a valid image file (JPEG or PNG).');
        return;
      }
      setFormData(prev => ({ ...prev, paymentProof: file }));
      setPaymentError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.paymentMethod === 'bank' && !formData.paymentProof) {
      setPaymentError('Please provide legitimate proof of payment.');
      return;
    }
    setPaymentError('');
    onSubmit(e);
  };

  return (
    <div className="animate-fade-in">
      <h2 className="section-title">Payment Details</h2>

      <div className="space-y-6">
        {/* Price Breakdown */}
        <div className="bg-orange-50 dark:bg-gray-700/50 p-6 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Receipt className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h3 className="text-xl font-semibold text-orange-600 dark:text-orange-400">
              Price Breakdown
            </h3>
          </div>
          
          <div className="space-y-3">
            {/* Base Registration */}
            <div className="border-b pb-3">
              <div className="flex justify-between">
                <span>Base Registration ({formatOccupationType(formData.occupationType)}):</span>
                <span className="font-medium">RM {pricing.basePrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Kids Registration */}
            {formData.hasKids && (
              <div className="border-b pb-3">
                <div className="flex justify-between">
                  <span>Children Registration ({formData.kidsDetails.length} × RM {PRICING_CONFIG.kidsRate}):</span>
                  <span className="font-medium">RM {pricing.kidsTotal.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* T-shirts */}
            {formData.orderTshirt && formData.tshirtOrders.length > 0 && (
              <div className="border-b pb-3">
                <div className="flex justify-between">
                  <span>T-shirts ({formData.tshirtOrders.reduce((sum, order) => sum + order.quantity, 0)} pieces):</span>
                  <span className="font-medium">RM {pricing.tshirtTotal.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Subtotal */}
            <div className="border-b pb-3">
              <div className="flex justify-between font-medium">
                <span>Subtotal:</span>
                <span className="text-orange-600 dark:text-orange-400">RM {pricing.subtotal.toFixed(2)}</span>
              </div>
            </div>
            {/* Early Bird Discount */}
            {isEarlyBird && (
              <div className="border-b pb-3">
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Early Bird Discount:</span>
                <span>- RM {pricing.discount.toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Fixed discount for early registration
              </div>
              </div>
            )}

            {/* Final Total */}
            <div className="pt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount:</span>
                <span className="text-orange-600 dark:text-orange-400">RM {pricing.finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of the form remains the same */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <label className="form-label">Payment Method *</label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-orange-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  checked={formData.paymentMethod === 'bank'}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="text-orange-600 focus:ring-orange-500"
                  required
                />
                <div>
                  <p className="font-medium">Bank Transfer</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Receipt Requirements: Please provide legitimate proof of payment (e.g., a screenshot or receipt). Failure to submit valid proof will result in the registration being voided.
                  </p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-orange-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="deferred"
                  checked={formData.paymentMethod === 'deferred'}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="text-orange-600 focus:ring-orange-500"
                  required
                />
                <div>
                  <p className="font-medium">Deferred Payment</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Notice: If you are unable to pay in full at this time, you may select this option. The AOY Registration Team will reach out to discuss payment arrangements.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Bank Details */}
          {formData.paymentMethod === 'bank' && (
            <div className="animate-slide-up bg-blue-50 dark:bg-gray-700/50 p-6 rounded-lg">
              <div className="flex items-start space-x-3 mb-4">
                <CreditCard className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <h4 className="font-medium text-blue-700 dark:text-blue-300">Bank Account Details</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-200">Please transfer the exact amount</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p><strong>Bank:</strong> CIMB Bank Berhad</p>
                <p><strong>Account Name:</strong> SEVENTH-DAY ADVENTIST CORPORATION (MALAYSIA) BHD - AOY</p>
                <p><strong>Account Number:</strong> 800 1771 092</p>
                <p><strong>SWIFT code:</strong> CIBBMYKL</p>
                <p><strong>Reference:</strong> AOY 2025</p>
                <p className="text-xs mt-4">Include your full name as reference when making the transfer</p>
              </div>

              <div className="mt-6">
                <label className="form-label">Upload Payment Proof *</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-orange-500 dark:hover:border-orange-400 transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="paymentProof"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    required={formData.paymentMethod === 'bank'}
                  />
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Click to upload your payment proof
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Supported formats: JPEG, PNG
                  </p>
                </div>
                {formData.paymentProof && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                    File uploaded: {formData.paymentProof.name}
                  </p>
                )}
                {paymentError && (
                  <p className="text-red-500 text-sm mt-1">{paymentError}</p>
                )}
              </div>
            </div>
          )}

          {/* Deferred Payment Notice */}
          {formData.paymentMethod === 'deferred' && (
            <div className="animate-slide-up bg-yellow-50 dark:bg-gray-700/50 p-6 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-1" />
                <div>
                  <h4 className="font-medium text-yellow-700 dark:text-yellow-300">Deferred Payment Notice</h4>
                  <p className="text-sm text-yellow-600 dark:text-yellow-200 mt-2">
                    By selecting this option, you agree to discuss payment arrangements with the AOY Registration Team. Please note that this option is only available if you are unable to pay in full at this time.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button type="button" onClick={onBack} className="btn-secondary">
              Back
            </button>
            <button 
              type="submit" 
              onClick={onSubmit}
              className="btn-primary" 
              disabled={!formData.paymentMethod || (formData.paymentMethod === 'bank' && !formData.paymentProof)}
            >
              Complete Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;