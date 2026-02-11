import { ChunkRecord } from '../types';

const isProcedureStep = (line: string) => /^\s*(\d+\.|\d+\)|step\s+\d+)/i.test(line);
const isTableRow = (line: string) => /\|/.test(line) || /\t/.test(line);

export const chunkText = (
  docName: string,
  sourceBlocks: Array<{ page: number; section: string; text: string }>,
  maxChars = 900
): ChunkRecord[] => {
  const chunks: ChunkRecord[] = [];

  sourceBlocks.forEach((block) => {
    const lines = block.text.split('\n').map((l) => l.trimEnd());
    let buffer: string[] = [];
    let currentLength = 0;

    const flush = () => {
      if (!buffer.length) return;
      chunks.push({
        doc_name: docName,
        page_start: block.page,
        page_end: block.page,
        section_title: block.section,
        chunk_text: buffer.join('\n').trim(),
        embedding_vector: []
      });
      buffer = [];
      currentLength = 0;
    };

    lines.forEach((line, index) => {
      const next = lines[index + 1];
      const protectedBoundary =
        (isProcedureStep(line) && next && isProcedureStep(next)) ||
        (isTableRow(line) && next && isTableRow(next));

      buffer.push(line);
      currentLength += line.length;

      if (currentLength >= maxChars && !protectedBoundary) {
        flush();
      }
    });

    flush();
  });

  return chunks.filter((chunk) => chunk.chunk_text.length > 0);
};
