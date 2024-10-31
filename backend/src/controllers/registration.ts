// src/controllers/registration.ts

import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Registration } from '../entities/Registration';
import { uploadToCloudinary } from '../config/cloudinary';
import { calculateTotalPrice } from '../utils/pricing'; // Adjust the path as necessary
import { sendConfirmationEmail } from '../services/email';
import { logger } from '../utils/logger';

const registrationRepository = AppDataSource.getRepository(Registration);

/**
 * Creates a new registration.
 */
export const createRegistration = async (
  req: Request & { file?: Express.Multer.File },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let paymentProofUrl = null;
    if (req.file) {
      // Using memoryStorage
      paymentProofUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);
      logger.info('File uploaded to Cloudinary:', { url: paymentProofUrl });
    }

    // Parse kidsDetails and tshirtOrders from FormData
    let kidsDetails = [];
    let tshirtOrders = [];

    if (req.body.kidsDetails) {
      try {
        kidsDetails = JSON.parse(JSON.stringify((req.body.kidsDetails)));
      } catch (err) {
        logger.error('Error parsing kidsDetails:', err);
        res.status(400).json({
          message: 'Invalid format for kidsDetails',
        });
        return;
      }
    }

    if (req.body.tshirtOrders) {
      try {
        tshirtOrders = JSON.parse(JSON.stringify((req.body.tshirtOrders)));
      } catch (err) {
        logger.error('Error parsing tshirtOrders:', err);
        res.status(400).json({
          message: 'Invalid format for kidsDetails',
        });
        return;
      }
    }

    // Prepare registration data
    const registrationData = {
      ...req.body,
      kidsDetails: kidsDetails || [],
      tshirtOrders: tshirtOrders || [],
      paymentProofUrl,
      volunteer: req.body.volunteer === 'true',
      hasKids: req.body.hasKids === 'true',
      orderTshirt: req.body.orderTshirt === 'true',
      foodAllergies: req.body.foodAllergies === 'true',
      healthIssues: req.body.healthIssues === 'true',
      termsAccepted: req.body.termsAccepted === 'true',
    };

    // Calculate pricing
    const pricing = calculateTotalPrice(registrationData);
    registrationData.basePrice = pricing.basePrice;
    registrationData.kidsTotal = pricing.kidsTotal;
    registrationData.tshirtTotal = pricing.tshirtTotal;
    registrationData.subtotal = pricing.subtotal;
    registrationData.discount = pricing.discount;
    registrationData.finalTotal = pricing.finalTotal;
    registrationData.isEarlyBird = pricing.isEarlyBird;

    // Create and save registration
    const newRegistration = registrationRepository.create(registrationData);
    const savedRegistration = await registrationRepository.save(newRegistration) as unknown as Registration;

    // Send confirmation email
    await sendConfirmationEmail(savedRegistration);

    // Send response
    res.status(201).json({
      message: 'Registration successful',
      data: savedRegistration,
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Registration error:', { message: error.message, stack: error.stack });
    } else {
      logger.error('Registration error:', { message: 'Unknown error', error });
    }
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : (error as Error).message,
    });
  }
};
/**
 * Retrieves a registration by ID.
 */
export const getRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const registration = await registrationRepository.findOne({
      where: { id: req.params.id },
      relations: ['kidsDetails', 'tshirtOrders']
    });

    if (!registration) {
      res.status(404).json({ message: 'Registration not found' });
      return;
    }

    res.json(registration);
  } catch (error) {
    logger.error('Error fetching registration:', error);
    next(error);
  }
};

/**
 * Updates an existing registration.
 */
export const updateRegistration = async (
  req: Request & { file?: Express.Multer.File },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const registration = await registrationRepository.findOne({
      where: { id: req.params.id }
    });

    if (!registration) {
      res.status(404).json({ message: 'Registration not found' });
      return;
    }

    // Handle file upload if new payment proof is provided
    if (req.file) {
      const fileUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);
      req.body.paymentProofUrl = fileUrl;
    }

    registrationRepository.merge(registration, req.body);
    const updated = await registrationRepository.save(registration);

    res.json(updated);
  } catch (error) {
    logger.error('Error updating registration:', error);
    next(error);
  }
};

/**
 * Deletes a registration by ID.
 */
export const deleteRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const registration = await registrationRepository.findOne({
      where: { id: req.params.id }
    });

    if (!registration) {
      res.status(404).json({ message: 'Registration not found' });
      return;
    }

    await registrationRepository.remove(registration as Registration);

    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting registration:', error);
    next(error);
  }
};

/**
 * Confirms a registration by setting isConfirmed to true and status to 'confirmed'.
 */
export const confirmRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const registration = await registrationRepository.findOne({
      where: { id: req.params.id }
    });

    if (!registration) {
      res.status(404).json({ message: 'Registration not found' });
      return;
    }

    registration.isConfirmed = true;
    registration.status = 'confirmed';
    await registrationRepository.save(registration);

    res.json(registration);
  } catch (error) {
    logger.error('Error confirming registration:', error);
    next(error);
  }
};
