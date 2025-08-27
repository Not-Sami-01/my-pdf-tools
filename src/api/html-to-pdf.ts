import { Request, Response } from 'express';
import puppeteer from 'puppeteer';

const htmlToPdfHandler = async (req: Request, res: Response): Promise<void> => {
  const html: string = req.body.html;

  if (!html) {
    res.status(400).json({ error: 'HTML content is required' });
    return;
  }

  try {
    // Launch the puppeteer browser instance
    const browser = await puppeteer.launch({
      executablePath: puppeteer.executablePath(), // Ensures correct Chromium is used
    });

    const page = await browser.newPage();

    // Set content of the page
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Generate PDF buffer from the content
    const pdfBuffer: Uint8Array = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    // Close the browser after generating the PDF
    await browser.close();

    // Set the response headers for the PDF file
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="document.pdf"',
    });

    // Send the PDF buffer as the response
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}

export default htmlToPdfHandler;
