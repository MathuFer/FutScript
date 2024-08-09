const request = require('supertest');
const app = require('../index'); 

describe('API Tests', () => {
    it('GET /equipos should return an array and status code 200', async () => {
        const res = await request(app).get('/equipos');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /login with correct credentials should return an object', async () => {
        const res = await request(app)
            .post('/login')
            .send({ username: 'admin', password: '1234' });
        expect(res.statusCode).toBe(200);
        expect(typeof res.body).toBe('object');
    });

    it('POST /login with incorrect credentials should return status code 400', async () => {
        const res = await request(app)
            .post('/login')
            .send({ username: 'admin', password: 'wrongpassword' });
        expect(res.statusCode).toBe(400);
    });

    it('POST /equipos/:teamID/jugadores with valid token should return status code 201', async () => {
        const loginRes = await request(app)
            .post('/login')
            .send({ username: 'admin', password: '1234' });

        const token = loginRes.body.token;

        const res = await request(app)
            .post('/equipos/1/jugadores')
            .set('Authorization', token)
            .send({ name: 'Cristiano Ronaldo', position: 1 });

        expect(res.statusCode).toBe(201);
    });
});
