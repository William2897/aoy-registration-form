import { FormData } from '../App';

export type OccupationType = 'adult' | 'student' | 'ministry-stipend' | 'ministry-salary';

interface PricingConfig {
  baseRates: {
    [key in OccupationType]: number;
  };
  kidsRate: number;
  tshirtRate: number;
  earlyBirdDiscount: number;
}

export const PRICING_CONFIG: PricingConfig = {
  baseRates: {
    'adult': 210,
    'student': 160,
    'ministry-stipend': 170,
    'ministry-salary': 190
  },
  kidsRate: 150,
  tshirtRate: 30,
  earlyBirdDiscount: 0.15 // 15%
};

export const calculateTotalPrice = (formData: FormData): {
  basePrice: number;
  kidsTotal: number;
  tshirtTotal: number;
  subtotal: number;
  discount: number;
  finalTotal: number;
} => {
  // Base registration fee
  const basePrice = PRICING_CONFIG.baseRates[formData.occupationType as OccupationType] || PRICING_CONFIG.baseRates.adult;

  // Kids registration total
  const kidsTotal = formData.hasKids ? formData.kidsDetails.length * PRICING_CONFIG.kidsRate : 0;

  // T-shirt order total
  const tshirtTotal = formData.orderTshirt
    ? formData.tshirtOrders.reduce((sum, order) => sum + (order.quantity * PRICING_CONFIG.tshirtRate), 0)
    : 0;

  // Calculate subtotal before early bird discount
  const baseSubtotal = basePrice + kidsTotal + tshirtTotal;
  const earlyBirdSubtotal = basePrice + kidsTotal;

  // Apply early bird discount if applicable
  const isEarlyBird = checkEarlyBirdEligibility();
  const discount = isEarlyBird ? earlyBirdSubtotal * PRICING_CONFIG.earlyBirdDiscount : 0;

  // Calculate final total
  const subtotal = baseSubtotal;
  const finalTotal = subtotal - discount;

  return {
    basePrice,
    kidsTotal,
    tshirtTotal,
    subtotal,
    discount,
    finalTotal
  };
};

export const checkEarlyBirdEligibility = (): boolean => {
  const earlyBirdEndDate = new Date('2025-01-31'); // Example date
  return new Date() <= earlyBirdEndDate;
};