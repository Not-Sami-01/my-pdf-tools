import { colorStatusCode, getPath } from "./lib/helper";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import multer from "multer";
import { default as pdfMergerHandler } from "./api/pdf-merger";
import { default as htmlToPdfHandler } from "./api/html-to-pdf";
import { default as pdfSplitterHandler } from "./api/pdf-splitter";
import imageToPdf from "./api/image-to-pdf";
import reqInfoMiddleware from "./middleware/req-info-middleware";
import { tools } from "./lib/tools";
import { pageTitles } from "./lib/pageTitles";

const app = express();
const PORT = 5000;

// Middlewares
app.use(express.json({ limit: "5mb" })); // To parse JSON bodies with HTML content
app.use(reqInfoMiddleware); // Logging middleware

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// EJS setup
app.set("views", getPath("templates")); // where your .ejs files live
app.set("view engine", "ejs");

// Routes for the frontend pages
app.use(express.static(path.join(__dirname, "../", "public"))); // for serving static files (CSS, JS, images)

// Front-End Routes
app.get("/", (req: Request, res: Response) => {
  res.render("pages/index", {
    title: pageTitles.home,
    tools,
    activeTool: tools.home.name,
  });
});

app.get("/about", (req, res) => {
  res.render("pages/about", {
    title: "About Us",
    tools,
    activeTool: tools.about.name,
  });
});

app.get("/html-to-pdf", (req: Request, res: Response) =>
  res.render("pages/html-to-pdf-input", {
    tools,
    activeTool: tools.htmlToPDF.name,
    title: pageTitles.htmlToPDF,
  })
);

app.get("/pdf-merger", (req: Request, res: Response) =>
  res.render("pages/pdf-merger-input", {
    title: pageTitles.pdfMerger,
    tools,
    activeTool: tools.pdfMerger.name,
  })
);

app.get("/pdf-splitter", (req: Request, res: Response) =>
  res.render("pages/pdf-splitter-input", {
    title: pageTitles.pdfSplitter,
    tools,
    activeTool: tools.pdfSplitter.name,
  })
);

app.get("/image-to-pdf", (req: Request, res: Response) =>
  res.render("pages/image-to-pdf-input", {
    title: pageTitles.imageToPDF,
    tools,
    activeTool: tools.imageToPDF.name,
  })
);

// API Routes
app.post("/api/html-to-pdf", htmlToPdfHandler);
app.post("/api/pdf-merger", upload.array("pdfs"), pdfMergerHandler);
app.post("/api/pdf-splitter", upload.single("file"), pdfSplitterHandler);
app.post("/api/image-to-pdf", imageToPdf);

// Listener function
// app.listen(PORT, () => {
//   console.log(`The app is listening on http://localhost:${PORT}`);
// });

export default app;
