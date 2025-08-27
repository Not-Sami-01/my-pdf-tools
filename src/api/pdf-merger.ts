import { Request, Response } from 'express';
import { PDFDocument } from 'pdf-lib';

const pdfMergerHandler = async (req: Request, res: Response): Promise<void> => {
  // Ensure that the request has uploaded files and there are at least two PDFs
  if (!req.files || (req.files as Express.Multer.File[]).length < 2) {
    res.status(400).json({ error: 'Please upload at least two PDF files' });
    return;
  }

  try {
    // Create a new PDF document to hold merged pages
    const mergedPdf = await PDFDocument.create();

    // Iterate over each uploaded PDF file and merge the pages
    const files = req.files as Express.Multer.File[];

    for (const file of files) {
      const pdf = await PDFDocument.load(file.buffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    // Save the merged PDF to bytes
    const mergedBytes = await mergedPdf.save();

    // Set the response headers for the PDF file
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=merged.pdf',
    });

    // Send the merged PDF as a response
    res.send(Buffer.from(mergedBytes));
  } catch (err) {
    console.error('Merge error:', err);
    res.status(500).json({ error: 'Failed to merge PDFs' });
  }
};

export default pdfMergerHandler;
