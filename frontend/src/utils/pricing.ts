import { FormData } from '../App';

export type OccupationType = 
  | 'adult'
  | 'student'
  | 'ministry_salary'
  | 'ministry_stipend'
  | 'walk_in_full'
  | 'walk_in_partial'
  | 'child_5_12'    // Add new child types
  | 'child_below_4';

interface PricingConfig {
  baseRates: {
    [key in OccupationType]: number;
  };
  tshirtRate: number;
  earlyBirdDiscount: number;
  familyDiscountPercentage: number; // Add this
}

export const PRICING_CONFIG: PricingConfig = {
  baseRates: {
    'adult': 240,
    'student': 180,
    'ministry_salary': 240,
    'ministry_stipend': 180,
    'walk_in_full': 240, // This will be dynamically calculated
    'walk_in_partial': 100,
    'child_5_12': 50,
    'child_below_4': 0
  },
  tshirtRate: 30,
  earlyBirdDiscount: 20, // Changed from 0.15 to 20 (RM)
  familyDiscountPercentage: 5 // 5% discount for family registration
};

export const FAMILY_OCCUPATION_TYPES = [
  { type: 'adult', label: 'Adult', price: 240 },
  { type: 'student', label: 'Student', price: 180 },
  { type: 'ministry_salary', label: 'Ministry (Full Salary)', price: 240 },
  { type: 'ministry_stipend', label: 'Ministry (Stipend)', price: 180 },
  { type: 'child_5_12', label: 'Child (Ages 5-12)', price: 50 },
  { type: 'child_below_4', label: 'Child (4 and Below)', price: 0 }
];

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
  familyTotal: number; // Changed from kidsTotal
  tshirtTotal: number;
  subtotal: number;
  discount: number;
  familyDiscount: number; // Add this
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
  const familyTotal = formData.hasFamily ? 
    formData.familyDetails.reduce((sum, member) => 
      sum + PRICING_CONFIG.baseRates[member.occupationType as OccupationType], 0) : 0; // Changed from kidsDetails
  const tshirtTotal = formData.orderTshirt
    ? formData.tshirtOrders.reduce((sum, order) => sum + (order.quantity * PRICING_CONFIG.tshirtRate), 0)
    : 0;

  const baseSubtotal = basePrice + familyTotal + tshirtTotal;
  const isEarlyBird = checkEarlyBirdEligibility();
  const earlyBirdDiscount = isEarlyBird ? PRICING_CONFIG.earlyBirdDiscount : 0;
  
  // Calculate family discount (5% of subtotal) if there are family members
  const familyDiscount = formData.hasFamily && formData.familyDetails.length >= 2 
    ? (baseSubtotal * PRICING_CONFIG.familyDiscountPercentage / 100)
    : 0;

  const finalTotal = baseSubtotal - earlyBirdDiscount - familyDiscount;

  return {
    basePrice,
    familyTotal, // Changed from kidsTotal
    tshirtTotal,
    subtotal: baseSubtotal,
    discount: earlyBirdDiscount,
    familyDiscount,
    finalTotal
  };
};

export const checkEarlyBirdEligibility = (): boolean => {
  const earlyBirdEndDate = new Date('2025-03-02'); // Ends 2nd March 2025
  return new Date() <= earlyBirdEndDate;
};

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const validateOccupationTypeByAge = (dateOfBirth: string, occupationType: OccupationType): boolean => {
  const age = calculateAge(dateOfBirth);
  
  switch (occupationType) {
    case 'child_below_4':
      return age <= 4;
    case 'child_5_12':
      return age >= 5 && age <= 12;
    default:
      return age > 12; // All other occupation types require age > 12
  }
};

export const getOccupationTypesByAge = (dateOfBirth: string): OccupationType[] => {
  const age = calculateAge(dateOfBirth);
  
  if (age <= 4) {
    return ['child_below_4'];
  } else if (age >= 5 && age <= 12) {
    return ['child_5_12'];
  } else {
    return ['adult', 'student', 'ministry_salary', 'ministry_stipend'];
  }
};