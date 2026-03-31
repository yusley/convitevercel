import { deleteGuest, updateGuestStatus } from '../../../lib/db';

export default async function handler(req, res) {
  const authHeader = req.headers['x-admin-token'];
  if (authHeader !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      await deleteGuest(Number(id));
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao remover' });
    }
  }

  if (req.method === 'PATCH') {
    const { status } = req.body;
    if (!['confirmado', 'pendente', 'nao'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }
    try {
      await updateGuestStatus(Number(id), status);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao atualizar' });
    }
  }

  res.setHeader('Allow', ['DELETE', 'PATCH']);
  return res.status(405).json({ error: 'Método não permitido' });
}
