
const request = require('supertest');
const app = require('../backend/server');

describe('POST /api/tasks', () => {
  it('should create a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', 'Bearer your_jwt_token')
      .send({ title: 'Test Task', description: 'Task description', deadline: '2024-12-31', priority: 'high' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Task');
  });
});
            