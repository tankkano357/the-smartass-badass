import { AnswerSections, SearchResult } from '../types';

const sentenceSplit = (text: string) =>
  text
    .replace(/\s+/g, ' ')
    .trim()
    .match(/[^.!?]+[.!?]/g) ?? [];

const lineSteps = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^\d+[\.)]/.test(line));

const findSpecs = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /\b(ft-lb|nm|capacity|dot\s?5|psi|qt|oz|in-lb|mm)\b/i.test(line));

const findToolsParts = (text: string) => {
  const matches = text.match(/(?:tools?|parts?)\s*:\s*([^\n]+)/gi) ?? [];
  return matches
    .flatMap((row) => row.split(':')[1]?.split(',') ?? [])
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const citationSnippet = (text: string) => {
  const sentences = sentenceSplit(text);
  if (sentences.length) return sentences[0].trim();
  return text.trim().slice(0, 220);
};

export const composeAnswer = (results: SearchResult[]): AnswerSections | 'Not in the provided manuals.' => {
  if (!results.length) return 'Not in the provided manuals.';

  const top = results[0].chunk;
  const topSentences = sentenceSplit(top.chunk_text).slice(0, 2);

  return {
    bottomLine: (topSentences.join(' ') || top.chunk_text.slice(0, 260)).trim(),
    steps: lineSteps(top.chunk_text),
    toolsParts: findToolsParts(top.chunk_text),
    specifications: findSpecs(top.chunk_text),
    citations: results.map(({ chunk }) => ({
      document: chunk.doc_name,
      pages: chunk.page_start === chunk.page_end ? `${chunk.page_start}` : `${chunk.page_start}-${chunk.page_end}`,
      snippet: citationSnippet(chunk.chunk_text)
    }))
  };
};
