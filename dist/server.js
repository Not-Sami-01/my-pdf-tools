"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("./lib/helper");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const pdf_merger_1 = __importDefault(require("./api/pdf-merger"));
const html_to_pdf_1 = __importDefault(require("./api/html-to-pdf"));
const pdf_splitter_1 = __importDefault(require("./api/pdf-splitter"));
const image_to_pdf_1 = __importDefault(require("./api/image-to-pdf"));
const req_info_middleware_1 = __importDefault(require("./middleware/req-info-middleware"));
const tools_1 = require("./lib/tools");
const pageTitles_1 = require("./lib/pageTitles");
const app = (0, express_1.default)();
const PORT = 5000;
// Middlewares
app.use(express_1.default.json({ limit: "5mb" })); // To parse JSON bodies with HTML content
app.use(req_info_middleware_1.default); // Logging middleware
// Set up multer for file uploads
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// EJS setup
app.set("views", (0, helper_1.getPath)("templates")); // where your .ejs files live
app.set("view engine", "ejs");
// Routes for the frontend pages
app.use(express_1.default.static(path_1.default.join(__dirname, "../", "public"))); // for serving static files (CSS, JS, images)
// Front-End Routes
app.get("/", (req, res) => {
    res.render("pages/index", {
        title: pageTitles_1.pageTitles.home,
        tools: tools_1.tools,
        activeTool: tools_1.tools.home.name,
    });
});
app.get("/about", (req, res) => {
    res.render("pages/about", {
        title: "About Us",
        tools: tools_1.tools,
        activeTool: tools_1.tools.about.name,
    });
});
app.get("/html-to-pdf", (req, res) => res.render("pages/html-to-pdf-input", {
    tools: tools_1.tools,
    activeTool: tools_1.tools.htmlToPDF.name,
    title: pageTitles_1.pageTitles.htmlToPDF,
}));
app.get("/pdf-merger", (req, res) => res.render("pages/pdf-merger-input", {
    title: pageTitles_1.pageTitles.pdfMerger,
    tools: tools_1.tools,
    activeTool: tools_1.tools.pdfMerger.name,
}));
app.get("/pdf-splitter", (req, res) => res.render("pages/pdf-splitter-input", {
    title: pageTitles_1.pageTitles.pdfSplitter,
    tools: tools_1.tools,
    activeTool: tools_1.tools.pdfSplitter.name,
}));
app.get("/image-to-pdf", (req, res) => res.render("pages/image-to-pdf-input", {
    title: pageTitles_1.pageTitles.imageToPDF,
    tools: tools_1.tools,
    activeTool: tools_1.tools.imageToPDF.name,
}));
// API Routes
app.post("/api/html-to-pdf", html_to_pdf_1.default);
app.post("/api/pdf-merger", upload.array("pdfs"), pdf_merger_1.default);
app.post("/api/pdf-splitter", upload.single("file"), pdf_splitter_1.default);
app.post("/api/image-to-pdf", image_to_pdf_1.default);
// Listener function
app.listen(PORT, () => {
    console.log(`The app is listening on http://localhost:${PORT}`);
});
