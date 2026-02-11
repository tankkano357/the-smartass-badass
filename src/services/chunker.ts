import { ChunkRecord } from '../types';

const isProcedureStep = (line: string) => /^\s*(\d+\.|\d+\)|step\s+\d+)/i.test(line);
const isTableRow = (line: string) => /\|/.test(line) || /\t/.test(line);

const classifyLine = (line: string) => {
  if (isProcedureStep(line)) return 'step';
  if (isTableRow(line)) return 'table';
  return 'text';
};

const splitIntoUnits = (text: string) => {
  const lines = text.split('\n').map((line) => line.trimEnd()).filter(Boolean);
  const units: string[] = [];
  let buffer: string[] = [];
  let mode: 'step' | 'table' | 'text' | null = null;

  const flush = () => {
    if (!buffer.length) return;
    units.push(buffer.join('\n'));
    buffer = [];
  };

  lines.forEach((line) => {
    const nextMode = classifyLine(line);
    if (mode && mode !== nextMode) {
      flush();
    }
    mode = nextMode;
    buffer.push(line);
  });

  flush();
  return units;
};

export const chunkText = (
  docName: string,
  sourceBlocks: Array<{ page: number; section: string; text: string }>,
  maxChars = 900
): ChunkRecord[] => {
  const chunks: ChunkRecord[] = [];

  sourceBlocks.forEach((block) => {
    const units = splitIntoUnits(block.text);
    let buffer = '';

    const flush = () => {
      const chunkTextValue = buffer.trim();
      if (!chunkTextValue) return;
      chunks.push({
        doc_name: docName,
        page_start: block.page,
        page_end: block.page,
        section_title: block.section,
        chunk_text: chunkTextValue,
        embedding_vector: []
      });
      buffer = '';
    };

    units.forEach((unit) => {
      const candidate = buffer ? `${buffer}\n${unit}` : unit;
      if (candidate.length > maxChars && buffer) {
        flush();
        buffer = unit;
      } else {
        buffer = candidate;
      }
    });

    flush();
  });

  return chunks;
};
