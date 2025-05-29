import 'reflect-metadata';
import express, { Express } from 'express';
import * as dotenv from 'dotenv';
import authRoutes from './routes/authRoute';
import { InitializeDatabase } from './config/database';
import {errorHandler} from "./middleware/errorhandler"

dotenv.config();

const app: Express = express();
const PORT=process.env.PORT;

//Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/user', authRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the server
const startServer = async () => {
    try {
      // Initialize db connection
      await InitializeDatabase();
      
      // Start Express server
      app.listen(PORT, () => {
        console.log(` Server running on http://127.0.0.1:${PORT}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };
  
  // Run the server
  startServer();