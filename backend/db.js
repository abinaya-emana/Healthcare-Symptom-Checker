// backend/db.js
import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const file = join(__dirname, "db.json");
const adapter = new JSONFileSync(file);
const db = new LowSync(adapter, { history: [] });

// Ensure DB initialized
db.read();
if (!db.data) {
  db.data = { history: [] };
  db.write();
}

export default db;
