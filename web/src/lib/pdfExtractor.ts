// ClauseGuard Hybrid - Client-Side PDF Text Extractor (#BuildHybridAI)
// Completely client-side: Zero bytes sent over network to parse PDF documents.

import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker for Vite bundler with CDN fallback
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
} catch {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export interface PdfExtractResult {
  text: string;
  hiddenTextWarnings: string[];
}

/**
 * Scans any string for hidden zero-width Unicode characters or steganographic markers.
 */
export function scanTextForUnicodeAnomalies(text: string): string[] {
  const warnings: string[] = [];
  const ZERO_WIDTH_REGEX = /[\u200B-\u200D\uFEFF\u00AD\u200E\u200F\u202A-\u202E\u2060-\u2064]/g;
  const matches = text.match(ZERO_WIDTH_REGEX);

  if (matches && matches.length > 0) {
    const hexCodes = Array.from(new Set(matches.map((c) => 'U+' + c.charCodeAt(0).toString(16).toUpperCase()))).join(', ');
    warnings.push(
      `Detected ${matches.length} invisible zero-width Unicode character(s) (${hexCodes}) - potential hidden prompt-injection steganography payload.`
    );
  }

  return warnings;
}

/**
 * Extracts all plain text from a client-uploaded PDF File or ArrayBuffer.
 * Runs 100% locally in the browser sandbox.
 * Inspects items for suspicious hidden text (invisible Unicode, tiny fonts < 2px).
 */
export async function extractTextFromPdf(
  input: File | ArrayBuffer
): Promise<PdfExtractResult> {
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
  const hiddenTextWarnings: string[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Group text items by lines using transform coordinates or order
    const pageLines: string[] = [];
    let currentLine = '';

    for (const item of textContent.items) {
      if ('str' in item) {
        // 1. Inspect for zero-width / invisible Unicode characters
        const unicodeWarnings = scanTextForUnicodeAnomalies(item.str);
        for (const w of unicodeWarnings) {
          const entry = `Page ${pageNum}: ${w}`;
          if (!hiddenTextWarnings.includes(entry)) {
            hiddenTextWarnings.push(entry);
          }
        }

        // 2. Inspect for microscopic font sizes (< 2px) used to hide adversarial instructions
        const fontHeight = Math.abs(
          (item.transform && item.transform[3] !== undefined)
            ? item.transform[3]
            : (item as any).height ?? 12
        );

        if (fontHeight > 0 && fontHeight < 2 && item.str.trim().length > 0) {
          const entry = `Page ${pageNum}: Microscopic hidden font size (${fontHeight.toFixed(1)}px < 2px) detected in text "${item.str.slice(0, 35)}..."`;
          if (!hiddenTextWarnings.includes(entry)) {
            hiddenTextWarnings.push(entry);
          }
        }

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

  const extractedText = fullTextParts.join('\n\n').trim();

  // Also check full extracted document text for Unicode steganography
  const docUnicodeWarnings = scanTextForUnicodeAnomalies(extractedText);
  for (const w of docUnicodeWarnings) {
    if (!hiddenTextWarnings.includes(w)) {
      hiddenTextWarnings.push(w);
    }
  }

  return {
    text: extractedText,
    hiddenTextWarnings,
  };
}
