import { AnswerSections, SearchResult } from '../types';

const lineSteps = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^\d+[\.)]/.test(line));

export const composeAnswer = (results: SearchResult[]): AnswerSections | 'Not in the provided manuals.' => {
  if (!results.length) return 'Not in the provided manuals.';

  const top = results[0].chunk;
  const snippets = results.map((result) => result.chunk.chunk_text.slice(0, 240));

  const steps = lineSteps(top.chunk_text);
  const toolsParts = (top.chunk_text.match(/tools?:([^\n]+)/i)?.[1] || top.chunk_text.match(/parts?:([^\n]+)/i)?.[1])
    ?.split(',')
    .map((x) => x.trim())
    .filter(Boolean);

  const specifications = top.chunk_text
    .split('\n')
    .filter((line) => /\b(ft-lb|nm|capacity|dot\s?5|psi|qt|oz)\b/i.test(line));

  return {
    bottomLine: snippets[0],
    steps,
    toolsParts,
    specifications,
    citations: results.map(({ chunk }, idx) => ({
      document: chunk.doc_name,
      pages: chunk.page_start === chunk.page_end ? `${chunk.page_start}` : `${chunk.page_start}-${chunk.page_end}`,
      snippet: snippets[idx]
    }))
  };
};
