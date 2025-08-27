"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const pdf_merger_1 = __importDefault(require("./api/pdf-merger"));
const html_to_pdf_1 = __importDefault(require("./api/html-to-pdf"));
const pdf_splitter_1 = __importDefault(require("./api/pdf-splitter"));
const image_to_pdf_1 = __importDefault(require("./api/image-to-pdf"));
const app = (0, express_1.default)();
const PORT = 5000;
// Middleware to log request method and path
function middleware(req, res, next) {
    console.log(`Requested on Route: ${req.path} Method: ${req.method}`);
    next();
}
// Middlewares
app.use(express_1.default.json({ limit: "5mb" })); // To parse JSON bodies with HTML content
app.use(middleware); // Logging middleware
// Set up multer for file uploads
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// Routes for the frontend pages
app.get("/", (req, res) => {
    return res.sendFile(path_1.default.join(__dirname, "./templates/index.html"));
});
// Front-End Routes
app.get("/html-to-pdf", (req, res) => res.sendFile(path_1.default.join(__dirname, "./templates/html-to-pdf-input.html")));
app.get("/pdf-merger", (req, res) => res.sendFile(path_1.default.join(__dirname, "./templates/pdf-merger-input.html")));
app.get("/pdf-splitter", (req, res) => res.sendFile(path_1.default.join(__dirname, "./templates/pdf-splitter-input.html")));
app.get("/image-to-pdf", (req, res) => res.sendFile(path_1.default.join(__dirname, "./templates/image-to-pdf-input.html")));
// API Routes
app.post("/api/html-to-pdf", html_to_pdf_1.default);
app.post("/api/pdf-merger", upload.array("pdfs"), pdf_merger_1.default);
app.post("/api/pdf-splitter", upload.single("file"), pdf_splitter_1.default);
app.post("/api/image-to-pdf", image_to_pdf_1.default);
// Listener function
app.listen(PORT, () => {
    console.log(`The app is listening on http://localhost:${PORT}`);
});
