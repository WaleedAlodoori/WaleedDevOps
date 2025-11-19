import request from 'supertest';
import express from 'express';
import tasksRoute from '../src/routes/tasks.js';

const app = express();
app.use(express.json());
app.use('/api/tasks', tasksRoute);

describe('Tasks API', () => {
  let createdId;

  it('create a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task', status: 'todo' });
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
    createdId = res.body.id;
  });

  it('list tasks', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('update a task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${createdId}`)
      .send({ status: 'done' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('done');
  });

  it('delete a task', async () => {
    const res = await request(app).delete(`/api/tasks/${createdId}`);
    expect(res.statusCode).toBe(204);
  });
});
