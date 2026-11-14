// ClauseGuard Hybrid - Client-Side PDF Text Extractor (#BuildHybridAI)
// Completely client-side: Zero bytes sent over network to parse PDF documents.

import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker for Vite bundler with CDN fallback
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
} catch (e) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

/**
 * Extracts all plain text from a client-uploaded PDF File or ArrayBuffer.
 * Runs 100% locally in the browser sandbox.
 */
export async function extractTextFromPdf(input: File | ArrayBuffer): Promise<string> {
  let arrayBuffer: ArrayBuffer;

  if (input instanceof File) {
    arrayBuffer = await input.arrayBuffer();
  } else {
    arrayBuffer = input;
  }

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const fullTextParts: string[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Group text items by lines using transform coordinates or order
    const pageLines: string[] = [];
    let currentLine = '';

    for (const item of textContent.items) {
      if ('str' in item) {
        currentLine += item.str + ' ';
        if (item.hasEOL) {
          pageLines.push(currentLine.trim());
          currentLine = '';
        }
      }
    }

    if (currentLine.trim()) {
      pageLines.push(currentLine.trim());
    }

    const pageText = pageLines.join('\n');
    if (pageText.trim()) {
      fullTextParts.push(`--- PAGE ${pageNum} ---\n${pageText}`);
    }
  }

  return fullTextParts.join('\n\n').trim();
}
