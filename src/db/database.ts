import * as SQLite from 'expo-sqlite';

import { SCHEMA_SQL } from './schema';

const db = SQLite.openDatabaseSync('badass-smartass.db');

export const initDatabase = () => {
  SCHEMA_SQL.forEach((stmt) => db.execSync(stmt));
};

export default db;
