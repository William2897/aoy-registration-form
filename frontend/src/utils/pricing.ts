import { FormData } from '../App';

export type OccupationType = 
  | 'working_adult'
  | 'homemaker'
  | 'student'
  | 'ministry_salary'
  | 'ministry_stipend'
  | 'walk_in_full'
  | 'walk_in_partial'
  | 'child_5_12'
  | 'child_below_4';

interface PricingConfig {
  baseRates: {
    [key in OccupationType]: number;
  };
  tshirtRate: number;
  earlyBirdDiscount: number;
  familyDiscountPercentage: number;
}

export const PRICING_CONFIG: PricingConfig = {
  baseRates: {
    'working_adult': 240,
    'homemaker': 180, 
    'student': 180,
    'ministry_salary': 240,
    'ministry_stipend': 180,
    'walk_in_full': 240,
    'walk_in_partial': 100,
    'child_5_12': 50,
    'child_below_4': 0
  },
  tshirtRate: 30,
  earlyBirdDiscount: 20,
  familyDiscountPercentage: 5
};

export const FAMILY_OCCUPATION_TYPES = [
  { type: 'working_adult', label: 'Working Adult', price: 240 },
  { type: 'homemaker', label: 'Homemaker', price: 180 },
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
  familyTotal: number;
  tshirtTotal: number;
  subtotal: number;
  discount: number;
  familyDiscount: number;
  finalTotal: number;
} => {
  let basePrice;
  const isEarlyBird = checkEarlyBirdEligibility();
  
  if (formData.occupationType === 'walk_in_full') {
    basePrice = formData.walkInCategory ? 
      PRICING_CONFIG.baseRates[formData.walkInCategory as keyof typeof PRICING_CONFIG.baseRates] : 
      PRICING_CONFIG.baseRates.working_adult;
  } else {
    basePrice = PRICING_CONFIG.baseRates[formData.occupationType as OccupationType];
  }

  // Calculate early bird discount for main registrant
  const mainRegistrantDiscount = isEarlyBird && formData.occupationType !== 'child_below_4' 
    ? PRICING_CONFIG.earlyBirdDiscount 
    : 0;

  const familyTotal = formData.hasFamily ? 
    formData.familyDetails.reduce((sum, member) => 
      sum + PRICING_CONFIG.baseRates[member.occupationType as OccupationType], 0) : 0;

  // Calculate early bird discount for eligible family members
  const familyEarlyBirdDiscount = isEarlyBird && formData.hasFamily
    ? formData.familyDetails.reduce((sum, member) => 
        member.occupationType !== 'child_below_4' 
          ? sum + PRICING_CONFIG.earlyBirdDiscount 
          : sum, 0)
    : 0;

  const registrationSubtotal = basePrice + familyTotal;
  const totalEarlyBirdDiscount = mainRegistrantDiscount + familyEarlyBirdDiscount;
  
  // Calculate family discount only on registration fees
  const familyDiscount = formData.hasFamily 
    ? ((registrationSubtotal - totalEarlyBirdDiscount) * PRICING_CONFIG.familyDiscountPercentage / 100)
    : 0;

  const tshirtTotal = formData.orderTshirt
    ? formData.tshirtOrders.reduce((sum, order) => sum + (order.quantity * PRICING_CONFIG.tshirtRate), 0)
    : 0;

  return {
    basePrice,
    familyTotal,
    tshirtTotal,
    subtotal: registrationSubtotal + tshirtTotal,
    discount: totalEarlyBirdDiscount,
    familyDiscount,
    finalTotal: registrationSubtotal - totalEarlyBirdDiscount - familyDiscount + tshirtTotal
  };
};

export const checkEarlyBirdEligibility = (): boolean => {
  const earlyBirdEndDate = new Date('2025-03-02'); // Ends 2nd March 2025
  return new Date() <= earlyBirdEndDate;
};

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  return today.getFullYear() - birth.getFullYear();
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
    return ['working_adult', 'student', 'ministry_salary', 'ministry_stipend', 'homemaker'];
  }
};