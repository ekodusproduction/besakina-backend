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
import doctorRouter from './src/Features/Advertisement/Doctors/doctors.routes.js';

import chatRouter from './src/Features/Chats/chats.routes.js';
import homeRouter from './src/Features/Home/home.routes.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const app = express()
// Middleware setup

app.set('trust proxy', true);
app.use(cors({ credentials: true }));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use((req, res, next) => {
    console.log('origin- before', req.headers)
    console.log("ip", req.ip)
    console.log("url", req.url)
    console.log('origin', req.headers.origin)
    next();
})

// app.use('/api/public', (req, res, next) => {
//     // Check if the request origin matches the allowed origin
//     req.headers.origin = 'anonymous'
//     // Set the Access-Control-Allow-Origin header
//     res.setHeader('Access-Control-Allow-Origin', "*");
//     // Set other CORS headers
//     res.setHeader('Access-Control-Allow-Methods', 'GET');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-Forwarded-For, Content-Type, Accept');
//     next()
// });

console.log('request before files')
app.use('/api/public', express.static('public'));
// Route definitions
app.get("/api", (req, res) => {
    return res.status(200).send("Welcome to besakina backend server");
});

app.use("/api/users", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/property", propertyRouter);
app.use("/api/vehicles", vehiclesRouter);
app.use("/api/hospitals", hospitalsRouter);
app.use("/api/hospitality", hospitalityRouter);
app.use("/api/education", educationRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/plans", jwtAuth, plansRouter);
app.use('/api/chat', chatRouter)
app.use("/api/home", homeRouter)
// Error handling middleware
app.use(async (err, req, res, next) => {
    logger.info(err);
    if (err instanceof ApplicationError) {
        return await sendError(res, err.message, err.code);
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