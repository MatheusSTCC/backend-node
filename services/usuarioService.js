const bcrypt = require("bcrypt");
const sql = require("mssql");
const { config } = require("../config/bd");
const MecanicoService = require("./mecanicoService");

class UsuarioService {
  constructor() {
    this.config = config; // Armazena a configuração do banco de dados
    this.mecanicoService = new MecanicoService();
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

  // Buscar todos os usuários
  async findAll() {
    await this.connect();
    const result = await sql.query(
      "SELECT * FROM Usuario WHERE nivelAcesso = 'Mecanico'"
    );

    return result.recordset; // Retorna o conjunto de registros
  }

  // Buscar usuário por ID
  async findById(id) {
    await this.connect();
    const result = await sql.query`SELECT * FROM Usuario WHERE id = ${id}`;
    const mecanico = await this.mecanicoService.findById(id);
    const user = result.recordset[0];
    user.mecanico = mecanico;
    return result.recordset.length ? user : null;
  }

  // Buscar usuário por email
  async findByEmail(email) {
    await this.connect();
    const result =
      await sql.query`SELECT * FROM Usuario WHERE email = ${email}`;
    return result.recordset.length ? result.recordset[0] : null;
  }

  // Criar nova conta com senha definida pelo usuário
  async create(usuario) {
    const usuarioExistente = await this.findByEmail(usuario.email);
    if (!usuarioExistente) {
      const senhaHash = await bcrypt.hash(usuario.senha, 10);
      const statusUsuario = "ATIVO";
      const nivelAcesso = usuario?.nivelAcesso || "MECANICO";
      const result = await sql.query`DECLARE @Id INT; 
        INSERT INTO Usuario (nome, email, senha, nivelAcesso, statusUsuario) VALUES (${usuario.nome},${usuario.email}, ${senhaHash}, ${nivelAcesso}, ${statusUsuario}) 
        SET @Id = SCOPE_IDENTITY();
        SELECT * FROM Usuario WHERE id = @Id;`;
      const user = result.recordset[0]; // Normalmente você deve obter o ID gerado com a query abaixo

      await sql.query(
        `INSERT INTO Mecanico (nome, telefone, cpf, usuario_id,  statusMecanico,descricao, cidade) VALUES ('${usuario.nome}','${usuario.telefone}', '${usuario.cpf}', ${user.id},'ATIVO', '${usuario.descricao}', '${usuario.cidade}');`
      );

      return {
        ...usuario,
        id: result.rowsAffected[0],
      };
    }
    return null;
  }

  // Autenticar usuário
  async signin(email, senha) {
    const usuario = await this.findByEmail(email);

    // Verifica se o usuário existe
    if (!usuario) {
      throw new Error("Usuário não encontrado.");
    }

    // Verifica se o status do usuário é INATIVO
    if (usuario.statusUsuario === "INATIVO") {
      throw new Error("Usuário inativo. Não é possível fazer login.");
    }

    // Verifica a correspondência da senha
    const match = await bcrypt.compare(senha, usuario.senha);
    if (!match) {
      throw new Error("Senha incorreta.");
    }

    // Se tudo estiver correto, busca os dados do mecânico
    const mecanico = await this.mecanicoService.findById(usuario.id);
    usuario.mecanico = mecanico;

    return usuario;
  }

  // Inativar usuário
  async inativar(id) {
    const usuario = await this.findById(id);
    if (usuario) {
      await sql.query`UPDATE Usuario SET statusUsuario = ${"INATIVO"} WHERE id = ${id}`;
      return { ...usuario, statusUsuario: "INATIVO" };
    }
    return null;
  }

  // Reativar usuário
  async reativar(id) {
    const usuario = await this.findById(id);
    if (usuario) {
      const senhaHash = await bcrypt.hash("12345678", 10);
      const dataCadastro = new Date();

      await sql.query`UPDATE Usuario SET senha = ${senhaHash}, dataCadastro = ${dataCadastro}, statusUsuario = ${"ATIVO"} WHERE id = ${id}`;

      return {
        ...usuario,
        senha: senhaHash,
        dataCadastro,
        statusUsuario: "ATIVO",
      };
    }
    return null;
  }

  // Alterar senha do usuário
  async alterarSenha(id, novaSenha) {
    const usuario = await this.findById(id);
    if (usuario) {
      const senhaHash = await bcrypt.hash(novaSenha, 10);
      const dataCadastro = new Date();

      await sql.query`UPDATE Usuario SET senha = ${senhaHash}, dataCadastro = ${dataCadastro}, statusUsuario = ${"ATIVO"} WHERE id = ${id}`;

      return {
        ...usuario,
        senha: senhaHash,
        dataCadastro,
        statusUsuario: "ATIVO",
      };
    }
    return null;
  }

  async alterarDados(id, dados, foto) {
    // Encontra o usuário pelo ID
    const usuario = await this.findById(id);
    if (usuario) {
      // Extrai os dados do objeto fornecido
      const { nome, email, descricao, telefone, cidade } = dados;
      // Atualiza os dados do usuário na tabela Usuario
      if (foto) {
        // Atualiza com a foto se ela estiver presente
        await sql.query`
            UPDATE Usuario 
            SET nome = ${nome}, email = ${email}, foto = ${foto}
            WHERE id = ${id}`;
      } else {
        // Atualiza sem a foto se ela não estiver presente
        await sql.query`
            UPDATE Usuario 
            SET nome = ${nome}, email = ${email}
            WHERE id = ${id}`;
      }

      // Atualiza os dados do mecânico na tabela Mecanico
      await sql.query`
        UPDATE Mecanico 
        SET descricao = ${descricao}, telefone = ${telefone}, cidade = ${cidade} 
        WHERE usuario_id = ${id}`;

      return "Dados atualizados com sucesso";
    }

    return null;
  }
  async alterarDadosAdmin(id, dados) {
    // Encontra o usuário pelo ID
    const usuario = await this.findById(id);
    if (usuario) {
      // Extrai os dados do objeto fornecido
      const { nome, email, nivelAcesso, statusUsuario } = dados;

      // Atualiza sem a foto se ela não estiver presente
      await sql.query`
            UPDATE Usuario 
            SET nome = ${nome}, email = ${email}, nivelAcesso = ${nivelAcesso}, statusUsuario = ${statusUsuario}  
            WHERE id = ${id} `;

      // Atualiza os dados do mecânico na tabela Mecanico

      return "Dados atualizados com sucesso";
    }

    return null;
  }
}

module.exports = UsuarioService;
