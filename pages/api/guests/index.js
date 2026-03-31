import { getAllGuests, createGuest, guestExists } from '../../../lib/db';

export default async function handler(req, res) {
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
      console.error(err);
      return res.status(500).json({ error: 'Erro interno' });
    }
  }

  if (req.method === 'POST') {
    const { nome, phone, status, acomps } = req.body;
    if (!nome || nome.trim().length < 2) {
      return res.status(400).json({ error: 'Nome inválido' });
    }
    try {
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
      console.error(err);
      return res.status(500).json({ error: 'Erro interno' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Método não permitido' });
}
