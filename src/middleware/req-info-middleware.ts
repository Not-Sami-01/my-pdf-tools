import { NextFunction, Request, Response } from "express";
import { colorStatusCode } from "../lib/helper";

export default function reqInfoMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const timeStart = Date.now();

  Promise.all([next()]).then(() => {
    const timeTaken = Date.now() - timeStart;
    console.log(
      `${req.method} ${req.path} ${colorStatusCode(
        res.statusCode
      )} in ${timeTaken}ms`
    );
  });
}
