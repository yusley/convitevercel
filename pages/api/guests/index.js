import { getAllGuests, createGuest, guestExists } from '../../../lib/db';

export default async function handler(req, res) {
  // In serverless production (Vercel) a file-based DB is not writable.
  // If running on Vercel, require a hosted DATABASE_URL.
  if (process.env.VERCEL) {
    const dbUrl = process.env.DATABASE_URL || '';
    if (!dbUrl || dbUrl.startsWith('file:')) {
      console.error('/api/guests error: invalid DATABASE_URL in production:', dbUrl);
      const debug = process.env.DEBUG_API === '1';
      const userMsg = 'No DATABASE_URL configured for production or a file-based DB was detected. Use a hosted DB (eg. libSQL, Postgres, Vercel D1) and set DATABASE_URL in project settings.';
      return res.status(500).json({ error: debug ? userMsg : 'Erro interno' });
    }
  }
  if (req.method === 'GET') {
    // Allow a public, limited view when no admin token is provided
    const authHeader = req.headers['x-admin-token'];
    try {
      const guests = await getAllGuests();
      if (authHeader === process.env.ADMIN_PASSWORD) {
        return res.status(200).json(guests);
      }
      // Public listing: do not expose phone or other sensitive data
      const publicList = guests.map(g => ({ nome: g.nome, status: g.status, acomps: g.acomps }));
      return res.status(200).json(publicList);
    } catch (err) {
      console.error('/api/guests GET error:', err);
      const debug = process.env.DEBUG_API === '1';
      return res.status(500).json({ error: debug ? String(err.message || err) : 'Erro interno' });
    }
  }

  if (req.method === 'POST') {
    const { nome, phone, status, acomps } = req.body;
    if (!nome || nome.trim().length < 2) {
      return res.status(400).json({ error: 'Nome inválido' });
    }
    try {
      console.log('/api/guests POST body:', req.body);
      const exists = await guestExists(nome.trim());
      if (exists) {
        return res.status(409).json({ error: 'Convidado já confirmado' });
      }
      const guest = await createGuest({
        nome: nome.trim(),
        phone: phone?.trim() || '—',
        status: status || 'confirmado',
        acomps: acomps || [],
      });
      return res.status(201).json(guest);
    } catch (err) {
      console.error('/api/guests POST error:', err);
      const debug = process.env.DEBUG_API === '1';
      return res.status(500).json({ error: debug ? String(err.message || err) : 'Erro interno' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Método não permitido' });
}
