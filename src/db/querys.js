const {Pool} = require('pg');
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "skatepark",
    password: "raby1949",
    port: 5432,
});

const nuevoSkater = async(...data) =>{
    const consulta = {
        text: "INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) values ($1, $2, $3, $4, $5, $6, false) RETURNING *", 
        values: data
    }
    const result = await pool.query(consulta);
    return result.rows[0];
}

const getSkaters = async()=>{
    const result = await pool.query("SELECT * FROM skaters ORDER BY id ASC");
    return result.rows;
}

const revisionSkater = async(...data)=>{
    const consulta ={
        text: "UPDATE skaters SET estado = $2 WHERE id = $1 RETURNING *",
        values: data
    }
    const result = await pool.query(consulta);
    return result.rows[0];
}
module.exports = {
    nuevoSkater, getSkaters, revisionSkater
}