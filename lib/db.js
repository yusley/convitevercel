import { createClient } from '@libsql/client';

let client = null;

export function getDb() {
  if (!client) {
    client = createClient({
      url: process.env.DATABASE_URL || 'file:local.db',
      authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
    });
  }
  return client;
}

export async function initDb() {
  const db = getDb();
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS guests (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        nome      TEXT    NOT NULL,
        phone     TEXT    DEFAULT '—',
        status    TEXT    DEFAULT 'confirmado',
        acomps    TEXT    DEFAULT '[]',
        created_at TEXT   DEFAULT (datetime('now','localtime'))
      )
    `);
  } catch (err) {
    console.error('initDb error:', err && err.message ? err.message : err);
    // Provide clearer guidance for production environments (libSQL / hosted DB)
    const hint = [];
    if (process.env.VERCEL) {
      hint.push('On Vercel you must set a hosted DATABASE_URL (not a file: URL).');
      hint.push('If using libSQL, also set DATABASE_AUTH_TOKEN in project Environment Variables.');
    } else {
      hint.push('Check DATABASE_URL and DATABASE_AUTH_TOKEN environment variables.');
    }
    const message = `Database initialization failed. ${hint.join(' ')}`;
    // Rethrow with additional context so the API layer can surface it when DEBUG_API=1
    const e = new Error(message + ' Original: ' + (err && err.message ? err.message : String(err)));
    e.cause = err;
    throw e;
  }
}

export async function getAllGuests() {
  await initDb();
  const db = getDb();
  const result = await db.execute('SELECT * FROM guests ORDER BY id DESC');
  console.log('[db] getAllGuests rows:', result.rows);
  return result.rows.map(row => ({
    ...row,
    acomps: JSON.parse(row.acomps || '[]'),
  }));
}

export async function createGuest({ nome, phone, status, acomps }) {
  await initDb();
  const db = getDb();
  console.log('[db] createGuest input acomps type:', typeof acomps, acomps);
  await db.execute({
    sql: 'INSERT INTO guests (nome, phone, status, acomps) VALUES (?, ?, ?, ?)',
    args: [nome, phone || '—', status || 'confirmado', JSON.stringify(acomps || [])],
  });
  const last = await db.execute('SELECT * FROM guests ORDER BY id DESC LIMIT 1');
  const row = last.rows[0];
  console.log('[db] createGuest row acomps raw:', row.acomps);
  return { ...row, acomps: JSON.parse(row.acomps || '[]') };
}

export async function deleteGuest(id) {
  await initDb();
  const db = getDb();
  await db.execute({ sql: 'DELETE FROM guests WHERE id = ?', args: [id] });
}

export async function updateGuestStatus(id, status) {
  await initDb();
  const db = getDb();
  await db.execute({ sql: 'UPDATE guests SET status = ? WHERE id = ?', args: [status, id] });
}

export async function guestExists(nome) {
  await initDb();
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT id FROM guests WHERE LOWER(nome) = LOWER(?)',
    args: [nome],
  });
  return result.rows.length > 0;
}
