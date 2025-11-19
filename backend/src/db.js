import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, 'data.json');

function read() {
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, JSON.stringify({ tasks: [] }, null, 2));
  }
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function write(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export const db = {
  getAll() {
    return read().tasks;
  },
  getById(id) {
    return read().tasks.find(t => t.id === id) || null;
  },
  create(task) {
    const data = read();
    data.tasks.push(task);
    write(data);
    return task;
  },
  update(id, partial) {
    const data = read();
    const idx = data.tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    const now = new Date().toISOString();
    data.tasks[idx] = { ...data.tasks[idx], ...partial, updatedAt: now };
    write(data);
    return data.tasks[idx];
  },
  remove(id) {
    const data = read();
    const before = data.tasks.length;
    data.tasks = data.tasks.filter(t => t.id !== id);
    write(data);
    return data.tasks.length < before;
  }
};
