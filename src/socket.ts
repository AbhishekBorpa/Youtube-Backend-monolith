import { Server } from "socket.io";
import { Server as HttpServer } from "http";

const initializeSocket = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || "*",
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("🚀 A user connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("👋 User disconnected:", socket.id);
        });

        // Placeholder for real-time notifications
        socket.on("register", (userId: string) => {
            socket.join(userId);
            console.log(`User ${userId} registered for private notifications`);
        });
    });

    return io;
};

export { initializeSocket };
