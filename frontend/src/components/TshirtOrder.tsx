import React, { useState } from 'react';
import { FormData } from '../App';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface TshirtOrderProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  onBack: () => void;
}

const TshirtOrder: React.FC<TshirtOrderProps> = ({
  formData,
  setFormData,
  onNext,
  onBack,
}) => {
  const [, setShowError] = useState(false);
  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

  const addOrder = () => {
    setFormData(prev => ({
      ...prev,
      tshirtOrders: [...prev.tshirtOrders, { size: '', quantity: 1 }]
    }));
    setShowError(false);
  };

  const removeOrder = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tshirtOrders: prev.tshirtOrders.filter((_, i) => i !== index)
    }));
  };

  const updateOrder = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      tshirtOrders: prev.tshirtOrders.map((order, i) =>
        i === index ? { ...order, [field]: value } : order
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.orderTshirt && formData.tshirtOrders.length === 0) {
      setShowError(true);
    } else {
      onNext();
    }
  };

  const totalAmount = formData.tshirtOrders.reduce(
    (sum, order) => sum + order.quantity * 30,
    0
  );

  return (
    <div className="animate-fade-in">
      <h2 className="section-title">T-shirt Order</h2>
      <p className="section-subtitle">Order your AOY 2025 T-shirt <strong>(RM30 each)</strong></p>

      <div className="mb-8 grid grid-cols-2 gap-4">
        <img
          src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=400"
          alt="AOY 2025 T-shirt 1"
          className="w-full rounded-lg shadow-lg"
        />
        <img
          src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=400"
          alt="AOY 2025 T-shirt 2"
          className="w-full rounded-lg shadow-lg"
        />
      </div>
      

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-2 mb-6">
          <input
            type="checkbox"
            id="orderTshirt"
            checked={formData.orderTshirt}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                orderTshirt: e.target.checked,
                tshirtOrders: e.target.checked ? prev.tshirtOrders : []
              }));
              setShowError(false);
            }}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label htmlFor="orderTshirt" className="form-label mb-0">
            I would like to order T-shirt(s)
          </label>
        </div>
        {formData.orderTshirt && formData.tshirtOrders.length === 0 && (
          <p className="text-red-600">Please add at least one T-shirt order.</p>
        )}

        {formData.orderTshirt && (
          <div className="space-y-6">
            {formData.tshirtOrders.map((order, index) => (
              <div
                key={index}
                className="bg-orange-50 dark:bg-gray-700/50 p-6 rounded-lg relative animate-slide-up"
              >
                <button
                  type="button"
                  onClick={() => removeOrder(index)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                  <Trash2 size={20} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Size *</label>
                    <select
                      required
                      value={order.size}
                      onChange={(e) => updateOrder(index, 'size', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Select size</option>
                      {sizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Quantity *</label>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => updateOrder(index, 'quantity', Math.max(1, order.quantity - 1))}
                        className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        required
                        min="1"
                        value={order.quantity}
                        onChange={(e) => updateOrder(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="input-field text-center"
                      />
                      <button
                        type="button"
                        onClick={() => updateOrder(index, 'quantity', order.quantity + 1)}
                        className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addOrder}
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors duration-200"
            >
              <Plus size={20} />
              <span>Add T-shirt {formData.tshirtOrders.length + 1}</span>
            </button>

            {formData.tshirtOrders.length > 0 && (
              <div className="mt-6 p-4 bg-orange-100 dark:bg-gray-700 rounded-lg">
                <p className="text-lg font-semibold">
                  Total Amount: RM {totalAmount}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button type="button" onClick={onBack} className="btn-secondary">
            Back
          </button>
          <button type="submit" className="btn-primary" disabled={formData.orderTshirt && formData.tshirtOrders.length === 0}>
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default TshirtOrder;