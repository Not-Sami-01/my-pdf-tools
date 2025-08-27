import express, { Request, Response, NextFunction } from "express";
import path from "path";
import multer from "multer";
import { default as pdfMergerHandler } from "./api/pdf-merger";
import { default as htmlToPdfHandler } from "./api/html-to-pdf";
import { default as pdfSplitterHandler } from "./api/pdf-splitter";
import imageToPdf from "./api/image-to-pdf";

const app = express();
const PORT = 5000;

// Middleware to log request method and path
function middleware(req: Request, res: Response, next: NextFunction) {
  console.log(`Requested on Route: ${req.path} Method: ${req.method}`);
  next();
}

// Middlewares
app.use(express.json({ limit: "5mb" })); // To parse JSON bodies with HTML content
app.use(middleware); // Logging middleware

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes for the frontend pages
app.get("/", (req: Request, res: Response) => {
  return res.sendFile(path.join(__dirname, "./templates/index.html"));
});

// Front-End Routes
app.get("/html-to-pdf", (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, "./templates/html-to-pdf-input.html"))
);
app.get("/pdf-merger", (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, "./templates/pdf-merger-input.html"))
);
app.get("/pdf-splitter", (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, "./templates/pdf-splitter-input.html"))
);
app.get("/image-to-pdf", (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, "./templates/image-to-pdf-input.html"))
);

// API Routes
app.post("/api/html-to-pdf", htmlToPdfHandler);
app.post("/api/pdf-merger", upload.array("pdfs"), pdfMergerHandler);
app.post("/api/pdf-splitter", upload.single("file"), pdfSplitterHandler);
app.post("/api/image-to-pdf", imageToPdf);

// Listener function
app.listen(PORT, () => {
  console.log(`The app is listening on http://localhost:${PORT}`);
});
