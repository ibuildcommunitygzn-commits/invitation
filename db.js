const path = require('path');
const Database = require('better-sqlite3');

const db = new Database(path.join(__dirname, 'data', 'invitations.db'));

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS registrants (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    name             TEXT NOT NULL,
    phone            TEXT NOT NULL,
    email            TEXT NOT NULL,
    occupation       TEXT NOT NULL,
    attending        INTEGER NOT NULL DEFAULT 1,
    registered_at    TEXT NOT NULL,
    thankyou_sms_sid TEXT
  );
`);

// Migrate older databases created before email/occupation/attending existed.
const existingColumns = db.prepare(`PRAGMA table_info(registrants)`).all().map((c) => c.name);
if (!existingColumns.includes('email')) {
  db.exec(`ALTER TABLE registrants ADD COLUMN email TEXT NOT NULL DEFAULT ''`);
}
if (!existingColumns.includes('occupation')) {
  db.exec(`ALTER TABLE registrants ADD COLUMN occupation TEXT NOT NULL DEFAULT ''`);
}
if (!existingColumns.includes('attending')) {
  db.exec(`ALTER TABLE registrants ADD COLUMN attending INTEGER NOT NULL DEFAULT 1`);
}

module.exports = db;
