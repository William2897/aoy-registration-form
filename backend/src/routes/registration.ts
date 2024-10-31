// src/routes/registration.ts

import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';
import { upload } from '../middleware/upload';
import {
  createRegistration,
  getRegistration,
  updateRegistration,
  deleteRegistration,
  confirmRegistration
} from '../controllers/registration';

import { OccupationTypeValues } from "../utils/pricing";


export const registrationRouter = Router();

export const registrationValidation = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('dateOfBirth').isISO8601().withMessage('Invalid date of birth'),
  body('gender').isIn(['male', 'female']).withMessage('Invalid gender'),
  body('country').notEmpty().withMessage('Country is required'),
  body('occupationType').isIn(OccupationTypeValues).withMessage('Invalid occupation type'),
  body('conference').notEmpty().withMessage('Conference is required'),
  body('church').notEmpty().withMessage('Church is required'),
  body('volunteer').isBoolean().withMessage('Volunteer must be a boolean'),
  body('hasKids').isBoolean().withMessage('hasKids must be a boolean'),
  body('orderTshirt').isBoolean().withMessage('orderTshirt must be a boolean'),
  body('foodAllergies').isBoolean().withMessage('foodAllergies must be a boolean'),
  body('healthIssues').isBoolean().withMessage('healthIssues must be a boolean'),
  body('termsAccepted').isBoolean().withMessage('termsAccepted must be a boolean'),
  
  // Conditional validation for paymentProof
  body('paymentMethod').notEmpty().withMessage('Payment method is required'),
  body('paymentProof').custom((value, { req }) => {
    if (req.body.paymentMethod === 'bank') {
      if (!req.file) {
        throw new Error('Payment proof is required for bank transfer');
      }
    }
    return true;
  }),

  // Validate kidsDetails only if hasKids is true
  body('kidsDetails')
    .if(body('hasKids').equals('true'))
    .isArray()
    .withMessage('KidsDetails must be an array'),

  // Validate each kid's details if hasKids is true
  body('kidsDetails.*.fullName')
    .if(body('hasKids').equals('true'))
    .notEmpty()
    .withMessage('Child full name is required'),
  body('kidsDetails.*.dateOfBirth')
    .if(body('hasKids').equals('true'))
    .isISO8601()
    .withMessage('Invalid child date of birth'),
  body('kidsDetails.*.healthInfo')
    .if(body('hasKids').equals('true'))
    .optional()
    .isString()
    .withMessage('Invalid child health information'),

  // Validate tshirtOrders only if orderTshirt is true
  body('tshirtOrders')
    .if(body('orderTshirt').equals('true'))
    .isArray()
    .withMessage('TshirtOrders must be an array'),

  // Validate each tshirt order if orderTshirt is true
  body('tshirtOrders.*.size')
    .if(body('orderTshirt').equals('true'))
    .isIn(['XS','S', 'M', 'L', 'XL', '2XL','3XL'])
    .withMessage('Invalid tshirt size'),
  body('tshirtOrders.*.quantity')
    .if(body('orderTshirt').equals('true'))
    .isInt({ min: 1 })
    .withMessage('Tshirt quantity must be at least 1'),
];

// Routes
registrationRouter.post(
  '/',
  upload.single('paymentProof'),
  registrationValidation,
  validate, // Ensure 'validate' is after all validation checks
  createRegistration
);

registrationRouter.get('/:id', getRegistration);

registrationRouter.put(
  '/:id',
  upload.single('paymentProof'),
  // I may add validation middleware here as well
  validate, // If there are validation rules for updating
  updateRegistration
);

registrationRouter.delete('/:id', deleteRegistration);

registrationRouter.post('/:id/confirm', confirmRegistration);