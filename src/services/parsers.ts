import * as FileSystem from 'expo-file-system';
import * as mammoth from 'mammoth/mammoth.browser';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

type ParsedBlock = { page: number; section: string; text: string };

const base64ToUint8Array = (base64: string): Uint8Array => {
  if (!globalThis.atob) { throw new Error('Base64 decoder unavailable in runtime.'); }
  const binaryString = globalThis.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const parsePdf = async (uri: string): Promise<ParsedBlock[]> => {
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  const pdfData = base64ToUint8Array(base64);
  const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
  const blocks: ParsedBlock[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const text = content.items
      .map((item: any) => item.str)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    blocks.push({ page: pageNum, section: `Page ${pageNum}`, text });
  }

  return blocks;
};

export const parseDocx = async (uri: string): Promise<ParsedBlock[]> => {
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  const arrayBuffer = base64ToUint8Array(base64).buffer;
  const result = await mammoth.extractRawText({ arrayBuffer });
  const sections = result.value.split(/\n{2,}/).filter(Boolean);

  return sections.map((section, idx) => ({
    page: idx + 1,
    section: `Section ${idx + 1}`,
    text: section.trim()
  }));
};
