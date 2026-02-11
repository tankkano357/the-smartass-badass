export type IntentType =
  | 'PROCEDURE'
  | 'TORQUE_SPEC'
  | 'FLUID_SPEC'
  | 'DIAGNOSTIC_CODE'
  | 'MAINTENANCE_INTERVAL'
  | 'PART_REFERENCE'
  | 'OTHER';

export type ChunkRecord = {
  id?: number;
  doc_name: string;
  page_start: number;
  page_end: number;
  section_title: string;
  chunk_text: string;
  embedding_vector: number[];
};

export type SearchResult = {
  chunk: ChunkRecord;
  vectorScore: number;
  keywordScore: number;
  intentScore: number;
  confidence: number;
};

export type AnswerSections = {
  bottomLine: string;
  steps: string[];
  toolsParts?: string[];
  specifications?: string[];
  citations: Array<{
    document: string;
    pages: string;
    snippet: string;
  }>;
};

export type BikeProfile = {
  nickname: string;
  year: number;
  make: string;
  model: string;
  modelCode: string;
  vin: string;
  buildSheet: Record<string, string[]>;
  milestone: string;
};
