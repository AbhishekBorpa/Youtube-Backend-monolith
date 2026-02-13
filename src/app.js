"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var helmet_1 = __importDefault(require("helmet"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
var metric_middleware_1 = require("./middlewares/metric.middleware");
app.use(metric_middleware_1.requestLogger);
// Routes import
var user_routes_1 = __importDefault(require("./routes/user.routes"));
var tweet_routes_1 = __importDefault(require("./routes/tweet.routes"));
var subscription_routes_1 = __importDefault(require("./routes/subscription.routes"));
var video_routes_1 = __importDefault(require("./routes/video.routes"));
var comment_routes_1 = __importDefault(require("./routes/comment.routes"));
var like_routes_1 = __importDefault(require("./routes/like.routes"));
var playlist_routes_1 = __importDefault(require("./routes/playlist.routes"));
var dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
var healthcheck_routes_1 = __importDefault(require("./routes/healthcheck.routes"));
var search_routes_1 = __importDefault(require("./routes/search.routes"));
var report_routes_1 = __importDefault(require("./routes/report.routes"));
var notification_routes_1 = __importDefault(require("./routes/notification.routes"));
var donation_routes_1 = __importDefault(require("./routes/donation.routes"));
var admin_routes_1 = __importDefault(require("./routes/admin.routes"));
var activity_routes_1 = __importDefault(require("./routes/activity.routes"));
var watchProgress_routes_1 = __importDefault(require("./routes/watchProgress.routes"));
// Routes declaration
app.use("/api/v1/users", user_routes_1.default);
app.use("/api/v1/videos", video_routes_1.default);
app.use("/api/v1/likes", like_routes_1.default);
app.use("/api/v1/subscriptions", subscription_routes_1.default);
app.use("/api/v1/comments", comment_routes_1.default);
app.use("/api/v1/tweets", tweet_routes_1.default);
app.use("/api/v1/likes", like_routes_1.default);
app.use("/api/v1/playlist", playlist_routes_1.default);
app.use("/api/v1/dashboard", dashboard_routes_1.default);
app.use("/api/v1/healthcheck", healthcheck_routes_1.default);
app.use("/api/v1/search", search_routes_1.default);
app.use("/api/v1/reports", report_routes_1.default);
app.use("/api/v1/notifications", notification_routes_1.default);
app.use("/api/v1/donations", donation_routes_1.default);
app.use("/api/v1/admin", admin_routes_1.default);
app.use("/api/v1/activity", activity_routes_1.default);
app.use("/api/v1/watch-progress", watchProgress_routes_1.default);
// Global Error Handler
app.use(function (err, req, res, next) {
    var statusCode = err.statusCode || 500;
    var message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message: message,
        errors: err.errors || []
    });
});
exports.default = app;
