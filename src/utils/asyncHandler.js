"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
var asyncHandler = function (requestHandler) {
    return function (req, res, next) {
        Promise.resolve(requestHandler(req, res, next)).catch(function (err) { return next(err); });
    };
};
exports.asyncHandler = asyncHandler;
