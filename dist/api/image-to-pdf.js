"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pdf_lib_1 = require("pdf-lib");
const canvas_1 = require("canvas");
const multer_1 = __importDefault(require("multer"));
// Set up multer for handling image uploads (in memory)
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() }); // Memory storage to avoid saving to disk
// Handler for converting images to PDF
const imageToPdfHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure that files are provided (images uploaded through FormData)
        if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
            res.status(400).json({ error: 'No images provided for PDF conversion.' });
            return;
        }
        // Create a new PDF document
        const pdfDoc = yield pdf_lib_1.PDFDocument.create();
        // Ensure req.files is treated as an array of files
        const imageFiles = Array.isArray(req.files) ? req.files : [req.files];
        // Loop over each uploaded image file
        for (const file of imageFiles) {
            // Ensure the file has a buffer property (this should be automatically available)
            const imageBuffer = file.buffer; // Access the buffer directly from the Multer file object
            // Use Canvas to load the image
            const image = yield (0, canvas_1.loadImage)(imageBuffer.toString());
            // Create a canvas with the image size
            const canvas = (0, canvas_1.createCanvas)(image.width, image.height);
            const ctx = canvas.getContext('2d');
            // Draw the image on the canvas
            ctx.drawImage(image, 0, 0);
            // Get the image buffer from the canvas (JPEG format)
            const processedImageBuffer = canvas.toBuffer('image/jpeg');
            // Embed the image into the PDF document
            const embeddedImage = yield pdfDoc.embedJpg(processedImageBuffer);
            // Add a new page to the PDF
            const page = pdfDoc.addPage();
            const { width, height } = page.getSize();
            // Scale the image to fit the page width
            const scale = width / embeddedImage.width;
            // Draw the image onto the page
            page.drawImage(embeddedImage, {
                x: 0,
                y: height - embeddedImage.height * scale,
                width: embeddedImage.width * scale,
                height: embeddedImage.height * scale,
            });
        }
        // Serialize the PDF document to bytes
        const pdfBytes = yield pdfDoc.save();
        // Set response headers for the PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="converted.pdf"');
        // Send the generated PDF back to the client
        res.status(200).end(Buffer.from(pdfBytes));
    }
    catch (error) {
        console.error('Error creating PDF:', error);
        // Send an error response if anything goes wrong
        res.status(500).json({ error: 'Failed to convert images to PDF.' });
    }
});
exports.default = [upload.array('images'), imageToPdfHandler];
