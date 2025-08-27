"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = reqInfoMiddleware;
const helper_1 = require("../lib/helper");
function reqInfoMiddleware(req, res, next) {
    const timeStart = Date.now();
    Promise.all([next()]).then(() => {
        const timeTaken = Date.now() - timeStart;
        console.log(`${req.method} ${req.path} ${(0, helper_1.colorStatusCode)(res.statusCode)} in ${timeTaken}ms`);
    });
}
