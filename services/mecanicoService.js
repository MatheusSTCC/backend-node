const bcrypt = require("bcrypt");
const sql = require("mssql");
const { config } = require("../config/bd");

class MecanicoService {
  constructor() {
    this.config = config; // Armazena a configuração do banco de dados
  }

  // Conectar ao banco de dados
  async connect() {
    try {
      await sql.connect(this.config);
      console.log("Conectado ao banco de dados!");
    } catch (err) {
      console.error("Erro ao conectar ao banco de dados:", err);
      throw err; // Re-throw para que o erro possa ser tratado onde for chamado
    }
  }

  async findById(id) {
    await this.connect();
    const result =
      await sql.query`SELECT * FROM Mecanico WHERE usuario_id = ${id}`;
    return result.recordset.length ? result.recordset[0] : null;
  }
}

module.exports = MecanicoService;
