const presencaModel = require("../models/presencaModel");
const usuarioModel = require("../models/usuarioModel");

// Variaveis de testes para DEV
// ...............
const diaAmais = 2;
const horasAmais = 8;
const minutosAmais = 19;
// ...............
const registrarCheckin = async (req, res) => {
  const usuarioId = req.params.id;
  const dateAtual = horarioDeBrasilia();
  try {
    if (!usuarioId || usuarioId.trim() === "") {
      return res.status(400).json({ message: "ID do usuário inválido" });
    }

    const buscarUser = await usuarioModel.buscarUser(usuarioId);
    if (!buscarUser) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const presencaDia = await presencaModel.buscarPresencaDia(
      usuarioId,
      dateAtual
    );
    if (presencaDia) {
      return res.status(409).json({
        message: "Já foi feito registro para esse dia",
        presenca: presencaDia,
      });
    }

    const presenca = await presencaModel.registrarCheckin(
      buscarUser.id,
      dateAtual
    );
    return res
      .status(201)
      .json({ message: "Check-In realizado com sucesso", presenca });
  } catch (error) {
    console.error("Erro ao registrar Check-In:", error);
    return res
      .status(500)
      .json({ message: "Erro ao fazer Check-In", error: error.message });
  }
};

const registrarCheckout = async (req, res) => {
  const usuarioId = req.params.id;
  const dateAtual = horarioDeBrasilia();

  // testes
  dateAtual.setHours(
    dateAtual.getHours() + horasAmais,
    dateAtual.getMinutes() + minutosAmais,
    dateAtual.getSeconds(),
    dateAtual.getMilliseconds()
  );

  try {
    if (!usuarioId || usuarioId.trim() === "") {
      return res.status(400).json({ message: "ID do usuário inválido" });
    }

    const presencaDia = await presencaModel.buscarPresencaDia(
      usuarioId,
      dateAtual
    );
    if (!presencaDia || !presencaDia.entrada) {
      return res
        .status(400)
        .json({ message: "Não foi registrado presença para esse dia" });
    }

    if (presencaDia.saida) {
      return res.status(409).json({
        message: "Já foi registrado checkout para este dia",
        presenca: presencaDia,
      });
    }

    const horasTotais = calcularHorasTrabalhadas(
      presencaDia.entrada,
      dateAtual
    );

    const presenca = await presencaModel.registrarCheckout(
      presencaDia.id,
      dateAtual,
      `${horasTotais.horas}:${horasTotais.minutos}`
    );

    return res.status(200).json({ message: "Checkout realizado", presenca });
  } catch (error) {
    console.error("Erro ao registrar checkout:", error);
    return res
      .status(500)
      .json({ message: "Erro ao registrar checkout", error: error.message });
  }
};

const ultimasPresencas = async (req, res) => {
  const quantidade = parseInt(req.params.quantidade);

  try {
    if (quantidade > 100) {
      return res.status(400).json({
        message:
          "Quantidade inserida maior que a capacidade permitida para pesquisa",
      });
    }

    const resposta = await presencaModel.ultimasPresencas(quantidade);

    if (!resposta || resposta.length === 0) {
      return res.status(404).json({ message: "Nenhuma presença registrada" });
    }

    return res.status(200).json(resposta);
  } catch (error) {
    console.error("Erro ao buscar presenças:", error);
    return res
      .status(500)
      .json({ message: "Erro ao buscar presenças", error: error.message });
  }
};

const getPresencasUserMes = async (req, res) => {
  const { mes, usuarioId } = req.body;

  const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
  try {
    if (!usuarioId || usuarioId.trim() === "") {
      return res.status(400).json({ message: "ID do usuário inválido" });
    }

    if (!mes || !regex.test(mes)) {
      return res.status(400).json({ message: "Insira uma data válida" });
    }

    const buscarUser = await usuarioModel.buscarUser(usuarioId);
    if (!buscarUser) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    
    const relatorio = await presencaModel.getPresencasUserMes(
      usuarioId,
      mes
    );
    res.status(200).json(relatorio);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao gerar relatório", error });
  }
};

// Private

const horarioDeBrasilia = () => {
  const hoje = new Date();
  const fusoBrasilia = hoje.getHours() - 3;
  hoje.setHours(
    fusoBrasilia,
    hoje.getMinutes(),
    hoje.getSeconds(),
    hoje.getMilliseconds()
  );
  // testes
  hoje.setDate(hoje.getDate() + diaAmais);

  return hoje;
};

const calcularHorasTrabalhadas = (entrada, saida) => {
  const horaAlmoco = 1;
  const diferencaMs = new Date(saida) - new Date(entrada);
  const diferencaMsComAlmoco = diferencaMs - horaAlmoco * 60 * 60 * 1000; // 1 hora de almoço
  // Garante que a diferença nunca seja negativa
  const diferencaMsFinal = Math.max(diferencaMsComAlmoco, 0);

  const horas = Math.floor(diferencaMsFinal / (1000 * 60 * 60));
  const minutos = Math.round(
    (diferencaMsFinal % (1000 * 60 * 60)) / (1000 * 60)
  );

  return { horas, minutos };
};

module.exports = {
  registrarCheckin,
  registrarCheckout,
  ultimasPresencas,
  getPresencasUserMes,
};
