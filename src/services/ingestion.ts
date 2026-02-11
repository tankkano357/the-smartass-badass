import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

import db from '../db/database';
import { chunkText } from './chunker';
import { parseDocx, parsePdf } from './parsers';
import { storeChunks } from './retrieval';
import { embedText } from '../utils/embeddings';

const DOC_DIR = `${FileSystem.documentDirectory}manuals/`;

export const importManual = async () => {
  await FileSystem.makeDirectoryAsync(DOC_DIR, { intermediates: true });
  const picked = await DocumentPicker.getDocumentAsync({
    type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    copyToCacheDirectory: true
  });

  if (picked.canceled || !picked.assets.length) return null;
  const asset = picked.assets[0];
  const fileName = asset.name;
  const target = `${DOC_DIR}${Date.now()}-${fileName}`;
  await FileSystem.copyAsync({ from: asset.uri, to: target });

  const parser = fileName.toLowerCase().endsWith('.pdf') ? parsePdf : parseDocx;
  const blocks = await parser(target);
  const chunks = chunkText(fileName, blocks).map((chunk) => ({ ...chunk, embedding_vector: embedText(chunk.chunk_text) }));

  db.runSync('INSERT INTO documents (name, uri, type, imported_at) VALUES (?, ?, ?, ?)', [
    fileName,
    target,
    fileName.toLowerCase().endsWith('.pdf') ? 'pdf' : 'docx',
    new Date().toISOString()
  ]);

  storeChunks(chunks);
  return fileName;
};

export const listDocuments = () => db.getAllSync<any>('SELECT * FROM documents ORDER BY imported_at DESC');
