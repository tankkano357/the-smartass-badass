const EMBEDDING_DIM = 128;

const hashToken = (token: string): number => {
  let hash = 0;
  for (let i = 0; i < token.length; i += 1) {
    hash = (hash * 31 + token.charCodeAt(i)) >>> 0;
  }
  return hash;
};

export const embedText = (text: string): number[] => {
  const vector = Array.from({ length: EMBEDDING_DIM }, () => 0);
  text
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .forEach((token) => {
      const idx = hashToken(token) % EMBEDDING_DIM;
      vector[idx] += 1;
    });

  const norm = Math.sqrt(vector.reduce((sum, x) => sum + x * x, 0)) || 1;
  return vector.map((x) => x / norm);
};

export const cosineSimilarity = (a: number[], b: number[]): number => {
  const size = Math.min(a.length, b.length);
  let dot = 0;
  for (let i = 0; i < size; i += 1) {
    dot += a[i] * b[i];
  }
  return dot;
};
