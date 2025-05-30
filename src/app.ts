import 'reflect-metadata';
import express, { Express } from 'express';
import * as dotenv from 'dotenv';
import routes from './routes/index';
import { InitializeDatabase } from './config/database';
import {errorHandler} from "./middleware/errorhandler"
import swaggerUi from "swagger-ui-express";
import fs from "fs/promises"
dotenv.config();

const app: Express = express();
const PORT=process.env.PORT;

async function loadDocumentation() {
  try {
    const data = await fs.readFile(new URL("./doc/swagger.json"), "utf-8");
    // console.log("Swagger file loaded successfully!"); // Debugging log
    return JSON.parse(data);
  } catch (error) {
    // console.error("Error loading Swagger JSON:", error);
    return null; // Prevents app crash
  }
}
//Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/', routes);

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