// backend/src/types/FormData.ts

import { OccupationType } from "../utils/pricing";
import {TshirtOrder } from "../entities/TshirtOrder";
import { KidsDetail } from "../entities/KidsDetail";

export interface FormData {
  email: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  country: string;
  phone: string;
  occupationType: OccupationType
  conference: string;
  otherConference: string;
  church: string;
  volunteer: boolean;
  hasKids: boolean;
  orderTshirt: boolean;
  foodAllergies: boolean;
  allergiesDetails: string;
  healthIssues: boolean;
  healthDetails: string;
  paymentMethod: string;
  paymentProof?: Express.Multer.File | null;
  termsAccepted: boolean;
  kidsDetails: KidsDetail[];
  tshirtOrders: TshirtOrder[];
}
