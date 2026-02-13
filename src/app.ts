import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

import { requestLogger } from './middlewares/metric.middleware';
app.use(requestLogger);

// Routes import
import userRouter from './routes/user.routes';
import tweetRouter from "./routes/tweet.routes"
import subscriptionRouter from "./routes/subscription.routes"
import videoRouter from "./routes/video.routes"
import commentRouter from "./routes/comment.routes"
import likeRouter from "./routes/like.routes"
import playlistRouter from "./routes/playlist.routes"
import dashboardRouter from "./routes/dashboard.routes"
import healthcheckRouter from "./routes/healthcheck.routes"
import searchRouter from "./routes/search.routes"
    ;
import reportRouter from './routes/report.routes';
import notificationRouter from './routes/notification.routes';
import donationRouter from "./routes/donation.routes"
import adminRouter from "./routes/admin.routes"
import activityRouter from "./routes/activity.routes"
import watchProgressRouter from "./routes/watchProgress.routes"

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/search", searchRouter)
    ;
app.use("/api/v1/reports", reportRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/donations", donationRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/activity", activityRouter);
app.use("/api/v1/watch-progress", watchProgressRouter);

// Global Error Handler
app.use((err: any, req: any, res: any, next: any) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || []
    });
});

export default app;
