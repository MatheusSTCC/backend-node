// controllers/usuarioController.js

const UsuarioService = require("../services/usuarioService"); // Ajuste o caminho conforme necessário
const usuarioServiceInstanced = new UsuarioService();
const findAll = async (req, res) => {
  try {
    const usuarios = await usuarioServiceInstanced.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários", error });
  }
};

const findById = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await usuarioServiceInstanced.findById(id);
    if (usuario) {
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuário", error });
  }
};

const findByEmail = async (req, res) => {
  const { email } = req.query;
  try {
    const usuario = await usuarioServiceInstanced.findByEmail(email);
    if (usuario) {
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuário", error });
  }
};

const create = async (req, res) => {
  try {
    const usuario = await usuarioServiceInstanced.create(req.body);
    if (usuario) {
      return res
        .status(201)
        .json({ message: "Usuario cadastrado com sucesso" });
    }
    res.status(400).json({ message: "Usuario ja registrado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao criar usuário", error });
  }
};

const signin = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await usuarioServiceInstanced.signin(email, senha);
    if (usuario) {
      res.status(200).json(usuario);
    } else {
      res.status(401).json({ message: "Dados incorretos!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer login " + error.message });
  }
};

// Outros métodos...

const inativar = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await usuarioServiceInstanced.inativar(id);
    if (usuario) {
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao inativar usuário", error });
  }
};

const reativar = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await usuarioServiceInstanced.reativar(id);
    if (usuario) {
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao reativar usuário", error });
  }
};

const alterarSenha = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await usuarioServiceInstanced.alterarSenha(id, req.body);
    if (usuario) {
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao alterar senha", error });
  }
};

const alterarDados = async (req, res) => {
  const { id } = req.params;
  req.body = JSON.parse(req.body.dados);
  const fileBuffer = req.file ? req.file.buffer : null;
  try {
    const message = await usuarioServiceInstanced.alterarDados(
      id,
      req.body,
      fileBuffer
    );
    if (message) {
      res.status(203).json({ message });
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao alterar dados", error });
  }
};
const alterarDadosAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await usuarioServiceInstanced.alterarDadosAdmin(
      id,
      req.body
    );
    if (message) {
      res.status(203).json({ message });
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao alterar dados", error });
  }
};

// Exportando todas as funções
module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
  signin,
  inativar,
  reativar,
  alterarSenha,
  alterarDados,
  alterarDadosAdmin,
};
