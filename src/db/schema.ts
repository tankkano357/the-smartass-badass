export const SCHEMA_SQL = [
  `CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    uri TEXT NOT NULL,
    type TEXT NOT NULL,
    imported_at TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS chunks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    doc_name TEXT NOT NULL,
    page_start INTEGER NOT NULL,
    page_end INTEGER NOT NULL,
    section_title TEXT NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding_vector TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS inverted_index (
    token TEXT NOT NULL,
    chunk_id INTEGER NOT NULL,
    frequency INTEGER NOT NULL,
    PRIMARY KEY(token, chunk_id)
  );`,
  `CREATE TABLE IF NOT EXISTS qa_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS maintenance_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    mileage INTEGER NOT NULL,
    category TEXT NOT NULL,
    notes TEXT NOT NULL,
    parts TEXT NOT NULL,
    cost REAL NOT NULL
  );`
];
