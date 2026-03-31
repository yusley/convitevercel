import { createClient } from '@libsql/client';

let client = null;

export function getDb() {
  const rawUrl = process.env.DATABASE_URL || 'file:local.db';
  let url = rawUrl;
  // Convert libsql:// scheme (Turso) to https:// which @libsql/client accepts
  if (url.startsWith('libsql://')) {
    url = 'https://' + url.slice('libsql://'.length);
  }
  const authToken = process.env.DATABASE_AUTH_TOKEN || undefined;
  if (!client) {
    client = createClient({ url, authToken });
  }
  console.log('getDb: using', url, authToken ? '(auth token set)' : '(no auth token)');
  return client;
}

export async function initDb() {
  const db = getDb();
  const dbUrl = process.env.DATABASE_URL || '';
  // If using a hosted DB (not a local file: DB) assume schema is managed
  // externally and do NOT attempt to run CREATE TABLE here to avoid
  // hitting provider migrations APIs that may return 400. The CREATE
  // statement will run only for local file-based DBs.
  if (dbUrl && !dbUrl.startsWith('file:')) {
    console.log('initDb: detected hosted DATABASE_URL, skipping automatic CREATE TABLE');
    return;
  }

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
    // If the error looks like a migrations API problem (some providers
    // return 400 for migration endpoints, e.g., Turso), allow a graceful
    // fallback: log a warning and continue -- assuming the DB schema
    // will be created manually by the operator.
    const causeMsg = err && err.message ? err.message : String(err);
    if (causeMsg.includes('fetching migration jobs') || causeMsg.includes('Unexpected status code while fetching migration jobs')) {
      console.warn('initDb warning: migrations API appears unsupported or returned 400. If the guests table does not exist, create it manually in your DB. Continuing without creating table. Original:', causeMsg);
      return;
    }

    const e = new Error(message + ' Original: ' + causeMsg);
    e.cause = err;
    throw e;
  }
}

export async function getAllGuests() {
  try {
    await initDb();
    const db = getDb();
    const result = await db.execute('SELECT * FROM guests ORDER BY id DESC');
    console.log('[db] getAllGuests rows:', result.rows);
    return result.rows.map(row => ({
      ...row,
      acomps: JSON.parse(row.acomps || '[]'),
    }));
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    const debug = process.env.DEBUG_API === '1';
    // Log full error for debugging
    console.error('getAllGuests caught error:', err);
    if (msg.includes('fetching migration jobs') || msg.includes('Unexpected status code while fetching migration jobs')) {
      console.warn('getAllGuests warning: migrations API error detected, returning empty list. Original:', msg);
      if (debug) {
        try { console.error('getAllGuests detailed error dump:', JSON.stringify(err, Object.getOwnPropertyNames(err))); } catch (e) { console.error('failed to stringify error', e); }
      }
      return [];
    }
    throw err;
  }
}

export async function createGuest({ nome, phone, status, acomps }) {
  try {
    await initDb();
    const db = getDb();
    console.log('[db] createGuest input:', { nome, phone, status, acomps });

    // Insert the guest into the database
    await db.execute({
      sql: 'INSERT INTO guests (nome, phone, status, acomps) VALUES (?, ?, ?, ?)',
      args: [nome, phone || '—', status || 'confirmado', JSON.stringify(acomps || [])],
    });

    // Fetch the last inserted guest
    const last = await db.execute('SELECT * FROM guests ORDER BY id DESC LIMIT 1');
    const row = last?.rows?.[0] || null;

    if (!row) {
      console.warn('[db] createGuest: No row returned after insert. Constructing response manually.');
      return {
        status: 201, // Created
        data: {
          id: null,
          nome,
          phone: phone || '—',
          status: status || 'confirmado',
          acomps: acomps || [],
          created_at: new Date().toISOString(),
        },
      };
    }

    console.log('[db] createGuest success:', row);
    return {
      status: 201, // Created
      data: { ...row, acomps: JSON.parse(row.acomps || '[]') },
    };
  } catch (err) {
    const msg = err?.message || String(err);
    const debug = process.env.DEBUG_API === '1';

    console.error('[db] createGuest error:', err);

    // Handle specific migration-related errors gracefully
    if (msg.includes('fetching migration jobs') || msg.includes('Unexpected status code while fetching migration jobs')) {
      console.warn('[db] createGuest: Migration API error detected. Returning fallback response.');
      if (debug) {
        try {
          console.error('[db] createGuest detailed error:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
        } catch (e) {
          console.error('[db] createGuest failed to stringify error:', e);
        }
      }
      return {
        status: 500, // Internal Server Error
        error: 'Erro ao acessar o banco: migrations API retornou 400. Verifique DATABASE_URL / DATABASE_AUTH_TOKEN.',
      };
    }

    // Return a generic error message for unexpected errors
    return {
      status: 500, // Internal Server Error
      error: debug ? `Erro interno: ${msg}` : 'Erro interno',
    };
  }
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
  try {
    await initDb();
    const db = getDb();
    const result = await db.execute({
      sql: 'SELECT id FROM guests WHERE LOWER(nome) = LOWER(?)',
      args: [nome],
    });
    return result.rows.length > 0;
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    const debug = process.env.DEBUG_API === '1';
    console.error('guestExists caught error:', err);
    if (msg.includes('fetching migration jobs') || msg.includes('Unexpected status code while fetching migration jobs')) {
      console.warn('guestExists warning: migrations API error detected, assuming guest does not exist. Original:', msg);
      if (debug) {
        try { console.error('guestExists detailed error dump:', JSON.stringify(err, Object.getOwnPropertyNames(err))); } catch (e) { console.error('failed to stringify error', e); }
      }
      return false;
    }
    throw err;
  }
}
