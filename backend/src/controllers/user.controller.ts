import { Request, Response } from 'express';

export async function meHandler(req: Request, res: Response) {
  const u = req.user!;
  res.json({ id: u.id, email: u.email, name: null });
}
