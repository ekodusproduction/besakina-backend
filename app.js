import 'dotenv/config';

import express from "express";
import cors from "cors";
import path from 'path';
import helmet from "helmet"; // Security middleware
import rateLimit from "express-rate-limit"; // Rate limiting middleware


import { logger, loggerMiddleware } from './src/Middlewares/logger.middleware.js';
import { ApplicationError } from './src/ErrorHandler/applicationError.js';
import { sendError } from './src/Utility/response.js';
import { jwtAuth } from "./src/Middlewares/auth.middleware.js";
//routers
import categoryRouter from './src/Features/Categories/category.routes.js';
import plansRouter from './src/Features/Plans/plans.routes.js';
import userRouter from './src/Features/Users/users.routes.js';
import propertyRouter from './src/Features/Advertisement/Property/property.routes.js';
import vehiclesRouter from './src/Features/Advertisement/Vehicles/vehicles.routes.js';
import hospitalsRouter from './src/Features/Advertisement/Hospitals/hospitals.routes.js';
import hospitalityRouter from './src/Features/Advertisement/Hospitality/hospitality.routes.js';
import educationRouter from './src/Features/Advertisement/Education/education.routes.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const app = express()
// Middleware setup

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
// Logger middleware
// app.use(async (req, res, next) => loggerMiddleware(req, res, next));
app.use((req, res, next) => {
    console.log("ip", req.ip)
    console.log("url", req.url)
    next();
})
app.use('/api/public', express.static('public'));
// Route definitions
app.get("/api", (req, res) => {
    res.status(200).send("Welcome to besakina backend server");
});

app.use("/api/users", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/property", propertyRouter);
app.use("/api/vehicles", vehiclesRouter);
app.use("/api/hospitals", hospitalsRouter);
app.use("/api/hospitality", hospitalityRouter);
app.use("/api/education", educationRouter);
app.use("/api/doctors", propertyRouter);
app.use("/api/plans", jwtAuth, plansRouter);

// Error handling middleware
app.use(async (err, req, res, next) => {
    logger.info(err);
    if (err instanceof ApplicationError) {
        return await sendError(res, err.message, 500);
    }
    return await sendError(res, err.message, 500);
});

// Catch-all route for undefined routes
app.all("*", (req, res) => {
    return res.status(404).send({
        "message": "URL not found",
        "success": false,
        "http_status_code": 404
    });
});

export default app;