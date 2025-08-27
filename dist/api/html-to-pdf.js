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
const puppeteer_1 = __importDefault(require("puppeteer"));
const htmlToPdfHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const html = req.body.html;
    if (!html) {
        res.status(400).json({ error: 'HTML content is required' });
        return;
    }
    try {
        // Launch the puppeteer browser instance
        const browser = yield puppeteer_1.default.launch({
            executablePath: puppeteer_1.default.executablePath(), // Ensures correct Chromium is used
        });
        const page = yield browser.newPage();
        // Set content of the page
        yield page.setContent(html, { waitUntil: 'networkidle0' });
        // Generate PDF buffer from the content
        const pdfBuffer = yield page.pdf({
            format: 'A4',
            printBackground: true,
        });
        // Close the browser after generating the PDF
        yield browser.close();
        // Set the response headers for the PDF file
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="document.pdf"',
        });
        // Send the PDF buffer as the response
        res.send(pdfBuffer);
    }
    catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});
exports.default = htmlToPdfHandler;
