const presencaModel = require("../models/presencaModel");
const usuarioModel = require("../models/usuarioModel");

const registrarCheckin = async (req, res) => {
  const { usuarioId } = req.body;
  const dataAtual = new Date();

  try {
    const buscarUser = await usuarioModel.buscarUser(usuarioId);
    if (!buscarUser) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    const presenca = presencaModel.registrarPresenca(buscarUser.id, dataAtual);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao fazer checkin", error });
  }
};

const registrarAlmocoSaida = async (req, res) => {
  const { usuarioId } = req.body;
  const dataAtual = new Date();
};

const registrarAlmocoVolta = async (req, res) => {
  const { usuarioId } = req.body;
  const dataAtual = new Date();
};

const registrarCheckout = async (req, res) => {
  const { usuarioId } = req.body;
  const dataAtual = new Date();
};

module.exports = {
  registrarCheckin,
  registrarCheckout,
  registrarAlmocoSaida,
  registrarAlmocoVolta,
};
