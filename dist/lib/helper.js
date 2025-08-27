"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPath = void 0;
exports.colorStatusCode = colorStatusCode;
const path_1 = __importDefault(require("path"));
const getPath = (...routes) => path_1.default.join(__dirname, "../", ...routes);
exports.getPath = getPath;
function colorStatusCode(statusCode) {
    let colorStart;
    if (statusCode >= 200 && statusCode < 300)
        colorStart = "\x1b[32m";
    else if (statusCode >= 300 && statusCode < 400)
        colorStart = "\x1b[36m";
    else if (statusCode >= 400 && statusCode < 500)
        colorStart = "\x1b[33m";
    else if (statusCode >= 500)
        colorStart = "\x1b[31m";
    else
        colorStart = "\x1b[90m";
    return `${colorStart}${statusCode}\x1b[0m`;
}
