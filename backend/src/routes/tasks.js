import { Router } from 'express';
import { nanoid } from 'nanoid';
import { db } from '../db.js';

const router = Router();

const normalize = (body) => ({
  title: String(body.title || '').trim(),
  description: String(body.description || '').trim(),
  status: ['todo', 'doing', 'done'].includes(body.status) ? body.status : 'todo',
  assignee: String(body.assignee || '').trim(),
  dueDate: body.dueDate ? new Date(body.dueDate).toISOString() : null,
  labels: Array.isArray(body.labels) ? body.labels.map(String) : [],
});

router.get('/', (req, res) => {
  res.json(db.getAll());
});

router.get('/:id', (req, res) => {
  const item = db.getById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

router.post('/', (req, res) => {
  const base = normalize(req.body);
  if (!base.title) return res.status(400).json({ message: 'title is required' });
  const now = new Date().toISOString();
  const task = { id: nanoid(8), ...base, createdAt: now, updatedAt: now };
  db.create(task);
  res.status(201).json(task);
});

router.put('/:id', (req, res) => {
  const partial = normalize(req.body);
  const updated = db.update(req.params.id, partial);
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const ok = db.remove(req.params.id);
  if (!ok) return res.status(404).json({ message: 'Not found' });
  res.status(204).end();
});

export default router;
