import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { AppDataSource } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { registrationRouter } from './routes/registration';
import { setupCloudinary } from './config/cloudinary';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: 'https://aoy-registration.netlify.app', // Restrict CORS to your frontend domain
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(morgan('combined'));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/registration', registrationRouter);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  errorHandler(err, req, res, next);
});

// Database connection and server startup
const startServer = async () => {
  try {
    await AppDataSource.initialize();
    logger.info('Database connected successfully');

    // Initialize Cloudinary
    setupCloudinary();
    
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();

export default app;