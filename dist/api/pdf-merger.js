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
Object.defineProperty(exports, "__esModule", { value: true });
const pdf_lib_1 = require("pdf-lib");
const pdfMergerHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure that the request has uploaded files and there are at least two PDFs
    if (!req.files || req.files.length < 2) {
        res.status(400).json({ error: 'Please upload at least two PDF files' });
        return;
    }
    try {
        // Create a new PDF document to hold merged pages
        const mergedPdf = yield pdf_lib_1.PDFDocument.create();
        // Iterate over each uploaded PDF file and merge the pages
        const files = req.files;
        for (const file of files) {
            const pdf = yield pdf_lib_1.PDFDocument.load(file.buffer);
            const copiedPages = yield mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
        // Save the merged PDF to bytes
        const mergedBytes = yield mergedPdf.save();
        // Set the response headers for the PDF file
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=merged.pdf',
        });
        // Send the merged PDF as a response
        res.send(Buffer.from(mergedBytes));
    }
    catch (err) {
        console.error('Merge error:', err);
        res.status(500).json({ error: 'Failed to merge PDFs' });
    }
});
exports.default = pdfMergerHandler;
