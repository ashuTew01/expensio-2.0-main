import request from 'supertest';
import express from 'express';
import expenseRoutes from '../routes/expenseRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/expenses', expenseRoutes);

describe('Expense API', () => {
    it('should get all expenses', async () => {
        const res = await request(app).get('/api/expenses');
        expect(res.statusCode).toEqual(200);
    });

    it('should create a new expense', async () => {
        const res = await request(app)
            .post('/api/expenses')
            .send({
                title: 'Test Expense',
                amount: 100,
                category: 'Test',
                description: 'This is a test expense',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.title).toBe('Test Expense');
    });
});
