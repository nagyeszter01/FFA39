const sql = require("mssql");
require("dotenv").config();

const beallitas = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function kapcsolodas() {
    const kapcsolat = await sql.connect(beallitas);
    return kapcsolat;
}

module.exports = {
    sql,
    kapcsolodas
};