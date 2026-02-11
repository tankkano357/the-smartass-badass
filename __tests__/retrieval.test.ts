jest.mock('../src/db/database', () => ({
  __esModule: true,
  default: {
    getAllSync: jest.fn((sql: string) => {
      if (sql.includes('FROM chunks')) {
        return [
          { id: 1, doc_name: 'A', page_start: 1, page_end: 1, section_title: 's', chunk_text: 'Torque to 35 ft-lb', embedding_vector: JSON.stringify([1, 0, 0]) },
          { id: 2, doc_name: 'B', page_start: 2, page_end: 2, section_title: 's', chunk_text: 'Paint color black', embedding_vector: JSON.stringify([0, 1, 0]) }
        ];
      }
      if (sql.includes('FROM inverted_index')) {
        return [{ chunk_id: 1, overlap: 4 }];
      }
      return [];
    }),
    runSync: jest.fn(),
    getFirstSync: jest.fn(() => ({ id: 1 }))
  }
}));

import { hybridSearch } from '../src/services/retrieval';
import * as embeddings from '../src/utils/embeddings';

jest.spyOn(embeddings, 'embedText').mockImplementation(() => [1, 0, 0]);

describe('hybridSearch merge', () => {
  it('ranks relevant chunk first', () => {
    const { results } = hybridSearch('torque spec');
    expect(results[0].chunk.doc_name).toBe('A');
  });

  it('returns refusal when low confidence', () => {
    jest.spyOn(embeddings, 'embedText').mockImplementation(() => [0, 0, 1]);
    const { refused } = hybridSearch('unrelated thing');
    expect(refused).toBe(true);
  });
});
