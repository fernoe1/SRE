import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import nodemailer from 'nodemailer';
import client from 'prom-client';

import userRoutes from './routes/user.js';
import sneakerRoutes from './routes/sneaker.js';
import basketRoutes from './routes/basket.js';

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
        user: process.env.SMTP_GMAIL,
        pass: process.env.SMTP_GMAIL_PASS
    }
})

const app = express();

client.collectDefaultMetrics();

const httpRequests = new client.Counter({
    name: "http_requests_total",
    help: "Total HTTP requests",
    labelNames: ["method", "route", "status"]
});

const httpDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "Request duration in seconds",
    buckets: [0.1, 0.3, 0.5, 1, 2]
});

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    const end = httpDuration.startTimer();

    res.on("finish", () => {
        httpRequests.inc({
            method: req.method,
            route: req.route?.path || req.path,
            status: res.statusCode
        });

        end();
    });

    next();
});
app.use('/users', userRoutes);
app.use('/sneakers', sneakerRoutes)
app.use('/baskets', basketRoutes);
app.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
});


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("Connected to MongoDB && listening on", process.env.PORT);
        });
    })
    .catch((err) => {
        console.log(err);
    });