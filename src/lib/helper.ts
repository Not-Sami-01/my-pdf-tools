import path from "path";

export const getPath = (...routes: string[]) =>
  path.join(__dirname, "../", ...routes);
export function colorStatusCode(statusCode: number) {
  let colorStart: string;
  if (statusCode >= 200 && statusCode < 300) colorStart = "\x1b[32m";
  else if (statusCode >= 300 && statusCode < 400) colorStart = "\x1b[36m";
  else if (statusCode >= 400 && statusCode < 500) colorStart = "\x1b[33m";
  else if (statusCode >= 500) colorStart = "\x1b[31m";
  else colorStart = "\x1b[90m";
  return `${colorStart}${statusCode}\x1b[0m`;
}
