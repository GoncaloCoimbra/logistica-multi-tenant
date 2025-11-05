"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginatedResponse = exports.errorResponse = exports.successResponse = void 0;
const successResponse = (res, data, message, statusCode = 200) => {
    const response = {
        success: true,
        message,
        data,
    };
    return res.status(statusCode).json(response);
};
exports.successResponse = successResponse;
const errorResponse = (res, message, statusCode = 400) => {
    const response = {
        success: false,
        message,
    };
    return res.status(statusCode).json(response);
};
exports.errorResponse = errorResponse;
const paginatedResponse = (res, data, page, limit, total, message) => {
    const response = {
        success: true,
        message,
        data,
        meta: {
            page,
            limit,
            total,
        },
    };
    return res.status(200).json(response);
};
exports.paginatedResponse = paginatedResponse;
