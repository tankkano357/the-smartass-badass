jest.mock('../src/services/retrieval', () => ({
  hybridSearch: jest.fn()
}));

jest.mock('../src/db/database', () => ({
  __esModule: true,
  default: {
    runSync: jest.fn(),
    getAllSync: jest.fn()
  }
}));

import { hybridSearch } from '../src/services/retrieval';
import { answerQuestion } from '../src/services/qa';

const mockHybridSearch = hybridSearch as jest.Mock;

describe('answerQuestion refusal behavior', () => {
  it('returns exact not-found message', () => {
    mockHybridSearch.mockReturnValue({ results: [], refused: false });
    expect(answerQuestion('where torque?')).toEqual({ status: 'NOT_FOUND', message: 'Not in the provided manuals.' });
  });

  it('returns exact low-confidence message', () => {
    mockHybridSearch.mockReturnValue({
      results: [{ chunk: { doc_name: 'A', page_start: 1, page_end: 1, section_title: 's', chunk_text: 'x', embedding_vector: [] }, vectorScore: 0, keywordScore: 0, intentScore: 0, confidence: 0 }],
      refused: true
    });
    expect(answerQuestion('random')).toEqual({ status: 'LOW_CONFIDENCE', message: "They can't all be golden." });
  });
});
