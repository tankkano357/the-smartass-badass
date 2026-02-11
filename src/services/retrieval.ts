import db from '../db/database';
import { ChunkRecord, SearchResult } from '../types';
import { embedText, cosineSimilarity } from '../utils/embeddings';
import { classifyIntent } from '../utils/intentClassifier';
import { tokenize } from '../utils/tokenizer';

const CONFIDENCE_THRESHOLD = 0.45;

export const storeChunks = (chunks: ChunkRecord[]) => {
  chunks.forEach((chunk) => {
    db.runSync(
      'INSERT INTO chunks (doc_name, page_start, page_end, section_title, chunk_text, embedding_vector) VALUES (?, ?, ?, ?, ?, ?)',
      [
        chunk.doc_name,
        chunk.page_start,
        chunk.page_end,
        chunk.section_title,
        chunk.chunk_text,
        JSON.stringify(chunk.embedding_vector)
      ]
    );
    const chunkId = db.getFirstSync<{ id: number }>('SELECT last_insert_rowid() as id')?.id;
    if (!chunkId) return;
    const tokenCount = new Map<string, number>();
    tokenize(chunk.chunk_text).forEach((token) => tokenCount.set(token, (tokenCount.get(token) ?? 0) + 1));
    tokenCount.forEach((frequency, token) => {
      db.runSync('INSERT OR REPLACE INTO inverted_index (token, chunk_id, frequency) VALUES (?, ?, ?)', [token, chunkId, frequency]);
    });
  });
};

export const hybridSearch = (query: string): { results: SearchResult[]; refused: boolean } => {
  const intent = classifyIntent(query);
  const queryEmbedding = embedText(query);
  const queryTokens = tokenize(query);

  const chunks = db.getAllSync<any>('SELECT * FROM chunks');
  const keywordRows = queryTokens.length
    ? db.getAllSync<any>(
        `SELECT chunk_id, SUM(frequency) as overlap FROM inverted_index WHERE token IN (${queryTokens
          .map(() => '?')
          .join(',')}) GROUP BY chunk_id`,
        queryTokens
      )
    : [];

  const keywordMap = new Map<number, number>(keywordRows.map((row: any) => [row.chunk_id, Number(row.overlap)]));

  const results: SearchResult[] = chunks
    .map((chunk: any) => {
      const embedding = JSON.parse(chunk.embedding_vector) as number[];
      const vectorScore = cosineSimilarity(queryEmbedding, embedding);
      const keywordScore = Math.min((keywordMap.get(chunk.id) ?? 0) / 8, 1);
      const intentScore = classifyIntent(chunk.chunk_text) === intent ? 1 : 0.4;
      const confidence = 0.55 * vectorScore + 0.25 * keywordScore + 0.2 * intentScore;
      return {
        chunk: {
          id: chunk.id,
          doc_name: chunk.doc_name,
          page_start: chunk.page_start,
          page_end: chunk.page_end,
          section_title: chunk.section_title,
          chunk_text: chunk.chunk_text,
          embedding_vector: embedding
        },
        vectorScore,
        keywordScore,
        intentScore,
        confidence
      };
    })
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);

  return { results, refused: (results[0]?.confidence ?? 0) < CONFIDENCE_THRESHOLD };
};
