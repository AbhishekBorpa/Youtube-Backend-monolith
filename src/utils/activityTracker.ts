import { Activity } from "../models/activity.model";

export const logActivity = async (
    userId: string,
    action: string,
    targetId: string,
    targetType: string,
    metadata?: Record<string, any>
) => {
    try {
        await Activity.create({
            user: userId,
            action,
            targetId,
            targetType,
            metadata
        });
    } catch (error) {
        // Silently fail or log to console/monitoring, but don't blocking the request
        console.error("Failed to log activity:", error);
    }
};
