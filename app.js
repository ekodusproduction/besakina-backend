import 'dotenv/config';

import express from "express";
import cors from "cors";
import { logger, loggerMiddleware } from './src/Middlewares/logger.middleware.js';
import { ApplicationError } from './src/ErrorHandler/applicationError.js';
import { sendError } from './src/Utility/response.js';
import { jwtAuth } from "./src/Middlewares/auth.middleware.js";
//routers
import categoryRouter from './src/Features/Categories/category.routes.js';
import plansRouter from './src/Features/Plans/plans.routes.js';
import userRouter from './src/Features/Users/users.routes.js';
import propertyRouter from './src/Features/Advertisement/Property/property.routes.js';

const app = express()
// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware
app.use(async (req, res, next) => {
    loggerMiddleware(req, res, next);
});

// Route definitions
app.get("/", (req, res) => {
    res.status(200).send("Welcome to besakina backend server");
});

app.use("/api/users", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/property", propertyRouter);
app.use("/api/plans", jwtAuth, plansRouter);

// Error handling middleware
app.use(async (err, req, res, next) => {
    logger.info(err);
    if (err instanceof ApplicationError) {
        return await sendError(res, err.message, null, err.code, null);
    }
    return await sendError(res, err, null, 500, null);
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