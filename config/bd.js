// database.js
const sql = require("mssql");

const config = {
  user: "SA", // seu usuário
  password: "MyStrongPass123", // sua senha
  server: "localhost", // endereço do servidor
  database: "bd_sosmecanico", // nome do banco de dados
  port: 1433,
  options: {
    encrypt: true, // deve ser true para Azure
    trustServerCertificate: true, // você pode alterar para true em desenvolvimento
  },
};

let pool;

async function connectToDatabase() {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log("Conexão ao banco de dados estabelecida com sucesso!");
    }
    return pool;
  } catch (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    throw err;
  }
}

module.exports = {
  connectToDatabase,
  sql,
  config,
};
