import { Request, Response, NextFunction } from "express";
import { Metric } from "../models/metric.model";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on("finish", async () => {
        const duration = Date.now() - start;
        const { method, originalUrl } = req;
        const { statusCode } = res;

        try {
            await Metric.create({
                path: originalUrl,
                method,
                statusCode,
                durationMs: duration,
                ip: req.ip
            });
        } catch (error) {
            console.error("Error logging metric:", error);
        }
    });

    next();
};
