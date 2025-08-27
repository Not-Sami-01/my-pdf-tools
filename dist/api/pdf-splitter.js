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
const pdfSplitterHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Ensure the file and pages are present in the request
        const fileBuffer = (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer;
        const pagesStr = req.body.pages;
        if (!fileBuffer || !pagesStr) {
            res.status(400).json({ error: 'PDF file and pages parameter are required.' });
            ;
        }
        // Parse the pages string into an array of page numbers (zero-based)
        const pages = parsePages(pagesStr || '');
        if (pages.length === 0) {
            res.status(400).json({ error: 'No valid pages provided.' });
            ;
        }
        // Load the original PDF document
        const originalPdf = yield pdf_lib_1.PDFDocument.load(fileBuffer || '');
        // Get the total number of pages in the original PDF
        const totalPages = originalPdf.getPageCount();
        // Filter out pages that are out of range
        const validPages = pages.filter(p => p >= 0 && p < totalPages);
        if (validPages.length === 0) {
            res.status(400).json({ error: 'No valid pages in range of PDF.' });
            return;
        }
        // Create a new PDF document
        const newPdf = yield pdf_lib_1.PDFDocument.create();
        // Copy the valid pages into the new PDF document
        const copiedPages = yield newPdf.copyPages(originalPdf, validPages);
        copiedPages.forEach((page) => newPdf.addPage(page));
        // Serialize the new PDF document to bytes
        const pdfBytes = yield newPdf.save();
        // Set response headers for the PDF file download
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=split.pdf',
            'Content-Length': pdfBytes.length.toString(),
        });
        // Send the PDF as the response
        res.send(Buffer.from(pdfBytes));
        return;
    }
    catch (error) {
        console.error('Error splitting PDF:', error);
        res.status(500).json({ error: 'Failed to split PDF.' });
        return;
    }
});
// Helper function to parse the pages string
function parsePages(pagesStr) {
    const pages = new Set();
    // Split the pages string by commas (e.g., "1-3,5,7")
    const parts = pagesStr.split(',');
    for (const part of parts) {
        if (part.includes('-')) {
            // Handle page range like "1-3"
            const [startStr, endStr] = part.split('-').map(s => s.trim());
            const start = parseInt(startStr, 10);
            const end = parseInt(endStr, 10);
            if (!isNaN(start) && !isNaN(end) && start <= end) {
                for (let i = start; i <= end; i++) {
                    pages.add(i - 1); // zero-based index for pages
                }
            }
        }
        else {
            // Single page (e.g., "2")
            const page = parseInt(part.trim(), 10);
            if (!isNaN(page)) {
                pages.add(page - 1); // zero-based index for pages
            }
        }
    }
    // Convert the set to an array and filter out invalid pages (negative indices)
    return Array.from(pages).filter(p => p >= 0);
}
exports.default = pdfSplitterHandler;
