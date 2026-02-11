import db from '../db/database';
import { applyToneOverlay } from './toneOverlay';
import { composeAnswer } from './answerComposer';
import { hybridSearch } from './retrieval';

export const answerQuestion = (question: string): string => {
  const { results, refused } = hybridSearch(question);
  if (!results.length) return 'Not in the provided manuals.';
  if (refused) return "They can't all be golden.";

  const structured = composeAnswer(results);
  if (structured === 'Not in the provided manuals.') return structured;

  const rendered = applyToneOverlay(structured);
  db.runSync('INSERT INTO qa_cache (question, answer, created_at) VALUES (?, ?, ?)', [question, rendered, new Date().toISOString()]);
  db.runSync(
    'DELETE FROM qa_cache WHERE id NOT IN (SELECT id FROM qa_cache ORDER BY created_at DESC LIMIT 50)'
  );
  return rendered;
};

export const getRecentQA = () => db.getAllSync<any>('SELECT * FROM qa_cache ORDER BY created_at DESC LIMIT 50');
