import { FormData } from '../App';

export type OccupationType = 
  | 'adult'
  | 'student'
  | 'ministry_salary'
  | 'ministry_stipend'
  | 'walk_in_full'
  | 'walk_in_partial';

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
    'adult': 260,
    'student': 200,
    'ministry_salary': 260,
    'ministry_stipend': 200,
    'walk_in_full': 260, // This will be dynamically calculated
    'walk_in_partial': 100
  },
  kidsRate: 50,
  tshirtRate: 30,
  earlyBirdDiscount: 20 // Changed from 0.15 to 20 (RM)
};

export const WALK_IN_DATES = {
  start: new Date('2025-06-05'),
  end: new Date('2025-06-08')
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).split('/').join('/');
};

export const isWalkInPeriod = (): boolean => {
  const now = new Date();
  return now >= WALK_IN_DATES.start && now <= WALK_IN_DATES.end;
};

export const getWalkInDateRangeText = (): string => {
  return `${formatDate(WALK_IN_DATES.start)} to ${formatDate(WALK_IN_DATES.end)}`;
};

export const calculateTotalPrice = (formData: FormData): {
  basePrice: number;
  kidsTotal: number;
  tshirtTotal: number;
  subtotal: number;
  discount: number;
  finalTotal: number;
} => {
  let basePrice;
  
  if (formData.occupationType === 'walk_in_full') {
    // Use the selected sub-category rate for walk-in full conference
    basePrice = formData.walkInCategory ? 
      PRICING_CONFIG.baseRates[formData.walkInCategory as keyof typeof PRICING_CONFIG.baseRates] : 
      PRICING_CONFIG.baseRates.adult;
  } else {
    basePrice = PRICING_CONFIG.baseRates[formData.occupationType as OccupationType];
  }

  // Rest of the calculation remains the same
  const kidsTotal = formData.hasKids ? formData.kidsDetails.length * PRICING_CONFIG.kidsRate : 0;
  const tshirtTotal = formData.orderTshirt
    ? formData.tshirtOrders.reduce((sum, order) => sum + (order.quantity * PRICING_CONFIG.tshirtRate), 0)
    : 0;

  const baseSubtotal = basePrice + kidsTotal + tshirtTotal;
  const isEarlyBird = checkEarlyBirdEligibility();
  const discount = isEarlyBird ? PRICING_CONFIG.earlyBirdDiscount : 0;

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