import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import { createCanvas, loadImage } from 'canvas';
import multer from 'multer';
import { Request, Response } from 'express';

// Set up multer for handling image uploads (in memory)
const upload = multer({ storage: multer.memoryStorage() });  // Memory storage to avoid saving to disk

// Handler for converting images to PDF
const imageToPdfHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    // Ensure that files are provided (images uploaded through FormData)
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      res.status(400).json({ error: 'No images provided for PDF conversion.' });
      return;
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Ensure req.files is treated as an array of files
    const imageFiles = Array.isArray(req.files) ? req.files : [req.files];

    // Loop over each uploaded image file
    for (const file of imageFiles) {
      // Ensure the file has a buffer property (this should be automatically available)
      const imageBuffer = file.buffer;  // Access the buffer directly from the Multer file object

      // Use Canvas to load the image
      const image = await loadImage(imageBuffer.toString());
      
      // Create a canvas with the image size
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');
      
      // Draw the image on the canvas
      ctx.drawImage(image, 0, 0);

      // Get the image buffer from the canvas (JPEG format)
      const processedImageBuffer = canvas.toBuffer('image/jpeg');

      // Embed the image into the PDF document
      const embeddedImage = await pdfDoc.embedJpg(processedImageBuffer);

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
    const pdfBytes = await pdfDoc.save();

    // Set response headers for the PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="converted.pdf"');

    // Send the generated PDF back to the client
    res.status(200).end(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Error creating PDF:', error);

    // Send an error response if anything goes wrong
    res.status(500).json({ error: 'Failed to convert images to PDF.' });
  }
};

export default [upload.array('images'), imageToPdfHandler];
