import * as FileSystem from 'expo-file-system';
import * as mammoth from 'mammoth/mammoth.browser';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

type ParsedBlock = { page: number; section: string; text: string };

type PdfItem = {
  str: string;
  hasEOL?: boolean;
  transform?: number[];
};

const base64ToUint8Array = (base64: string): Uint8Array => {
  if (!globalThis.atob) {
    throw new Error('Base64 decoder unavailable in runtime.');
  }
  const binaryString = globalThis.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const toLines = (items: PdfItem[]) => {
  const lines: string[] = [];
  let current = '';
  let lastY: number | null = null;

  items.forEach((item) => {
    const y = item.transform?.[5] ?? null;
    const yBreak = y !== null && lastY !== null && Math.abs(y - lastY) > 4;

    if (item.hasEOL || yBreak) {
      if (current.trim()) lines.push(current.trim());
      current = '';
    }

    current = `${current}${item.str} `;
    lastY = y;
  });

  if (current.trim()) lines.push(current.trim());
  return lines;
};

export const parsePdf = async (uri: string): Promise<ParsedBlock[]> => {
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  const data = base64ToUint8Array(base64);
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;
  const blocks: ParsedBlock[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const lines = toLines(content.items as PdfItem[]);
    blocks.push({ page: pageNum, section: `Page ${pageNum}`, text: lines.join('\n') });
  }

  return blocks;
};

export const parseDocx = async (uri: string): Promise<ParsedBlock[]> => {
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  const arrayBuffer = base64ToUint8Array(base64).buffer;
  const result = await mammoth.extractRawText({ arrayBuffer });
  const sections = result.value
    .split(/\n{2,}/)
    .map((section) => section.trim())
    .filter(Boolean);

  return sections.map((section, idx) => ({
    page: idx + 1,
    section: `Section ${idx + 1}`,
    text: section
  }));
};
