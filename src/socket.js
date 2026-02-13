"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = void 0;
var socket_io_1 = require("socket.io");
var initializeSocket = function (server) {
    var io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || "*",
            credentials: true
        }
    });
    io.on("connection", function (socket) {
        console.log("🚀 A user connected:", socket.id);
        socket.on("disconnect", function () {
            console.log("👋 User disconnected:", socket.id);
        });
        // Placeholder for real-time notifications
        socket.on("register", function (userId) {
            socket.join(userId);
            console.log("User ".concat(userId, " registered for private notifications"));
        });
    });
    return io;
};
exports.initializeSocket = initializeSocket;
