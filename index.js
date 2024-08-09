const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const { secretKey } = require('./utils');

app.listen(3000, console.log("SERVER ON"));

app.use(express.json());

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === '1234') {
        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(400).send({ message: 'Credenciales incorrectas' });
    }
});

const validateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send({ message: 'Token no provisto' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Token inválido' });
        }
        req.user = decoded;
        next();
    });
};

app.post('/equipos', validateToken, agregarEquipo);
app.post('/equipos/:teamID/jugadores', validateToken, registrarJugador);

const { obtenerJugadores, registrarJugador } = require('./controllers/jugadores')
const { obtenerEquipos, agregarEquipo } = require('./controllers/equipos')


app.get("/equipos", obtenerEquipos)
app.post("/equipos", agregarEquipo)

app.get("/equipos/:teamID/jugadores", obtenerJugadores)
app.post("/equipos/:teamID/jugadores", registrarJugador)

