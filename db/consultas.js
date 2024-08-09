const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'futscript',
    allowExitOnIdle: true
});

const getTeams = async () => {
    const result = await pool.query('SELECT id, name FROM equipos');
    return result.rows;
};

const getPlayers = async (teamID) => {
    const query = `
        SELECT jugadores.name, posiciones.name as posicion 
        FROM jugadores 
        INNER JOIN posiciones ON jugadores.position = posiciones.id 
        WHERE id_equipo = $1
    `;
    const result = await pool.query(query, [teamID]);
    return result.rows;
};

const addTeam = async (equipo) => {
    const result = await pool.query('INSERT INTO equipos (name) VALUES ($1) RETURNING *', [equipo.name]);
    return result.rows[0];
};

const addPlayer = async ({ jugador, teamID }) => {
    const result = await pool.query(
        'INSERT INTO jugadores (id_equipo, name, position) VALUES ($1, $2, $3) RETURNING *',
        [teamID, jugador.name, jugador.position]
    );
    return result.rows[0];
};

module.exports = { getTeams, addTeam, getPlayers, addPlayer };
