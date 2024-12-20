const usuarioModel = require("../models/usuarioModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const criarUsuario = async (req, res) => {
  const { login, senha, nome, tipo } = req.body;
  const tipos = ["medico", "admin"];

  try {
    if (!login || login.trim().length < 3) {
      return res
        .status(400)
        .json({ message: "Login inválido (mínimo 3 caracteres)" });
    }

    if (!senha || senha.trim().length < 3) {
      return res
        .status(400)
        .json({ message: "Senha inválida (mínimo 3 caracteres)" });
    }

    if (!nome || nome.trim().length < 3) {
      return res.status(400).json({
        message:
          "Nome não pode estar em branco e deve ter no mínimo 3 caracteres",
      });
    }

    if (!tipos.includes(tipo)) {
      return res.status(400).json({ message: "Tipo de usuário inválido" });
    }

    const existeUser = await usuarioModel.existeUser(login);
    if (existeUser) {
      return res
        .status(400)
        .json({ message: "Usuário ja cadastrado no sistema" });
    }

    const hashedSenha = await bcrypt.hash(senha, 10);
    await usuarioModel.createUser(login, hashedSenha, nome, tipo);

    res.status(200).json({ message: `Novo Usuário criado: ${login}` });
  } catch (error) {
    console.error("Erro ao Criar usuário:", error);
    return res.status(500).json({ message: "Erro ao criar usuário", error });
  }
};

const usuarioLogin = async (req, res) => {
  const { login, senha } = req.body;

  if (!login || !senha) {
    return res.status(400).json({ message: "Usuário ou senha inválidos" });
  }
  try {
    const existeUser = await usuarioModel.existeUser(login);
    if (!existeUser) {
      return res.status(400).json({ message: "Usuário ou Senha incorretos" });
    }

    const senhaCorreta = bcrypt.compare(senha, existeUser.senha);
    if (!senhaCorreta) {
      return res.status(404).json({ message: "Usuário ou Senha Incorretos" });
    }

    const token = jwt.sign(
      {
        id: existeUser.id,
        tipo: existeUser.tipo,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json(token);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao logar", error });
  }
};

const getUser = async (req, res) => {
  const usuarioId = req.params.id;

  if (!isNaN(usuarioId) || !usuarioId) {
    return res.status(400).json({ message: "ID de Usuário Inválido" });
  }

  try {
    const usuario = await usuarioModel.buscarUser(usuarioId);
    return res.status(200).json(usuario);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar usuário", error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await usuarioModel.getAllUsers();
    if (!users) {
      return res.status(404).json({ message: "Nenhum usuário encontrado" });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar usuários", error });
  }
};

module.exports = { criarUsuario, usuarioLogin, getAllUsers, getUser };
