const presencaModel = require("../models/presencaModel");
const usuarioModel = require("../models/usuarioModel");

const registrarCheckin = async (req, res) => {
  const usuarioId = parseInt(req.params.id);
  const dateAtual = horarioDeBrasilia();

  try {
    const buscarUser = await usuarioModel.buscarUser(usuarioId);
    if (!buscarUser) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    const presencaDia = await presencaModel.buscarRegistroDia(
      usuarioId,
      dateAtual
    );

    if (presencaDia) {
      return res
        .status(400)
        .json({ message: "Já foi feito registro para esse dia" });
    }

    const presenca = await presencaModel.registrarCheckin(
      buscarUser.id,
      dateAtual
    );

    res.status(200).json({ message: "Check-In Realizado", presenca });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao fazer Check-In", error });
  }
};

const registrarAlmocoSaida = async (req, res) => {
  const usuarioId = parseInt(req.params.id);
  const dateAtual = horarioDeBrasilia();
  try {
    const presencaDia = await presencaModel.buscarRegistroDia(
      usuarioId,
      dateAtual
    );

    if (!presencaDia || !presencaDia.entrada) {
      return res
        .status(400)
        .json({ message: "Não foi registrado presença para esse dia" });
    }

    if (presencaDia.almocoSaida) {
      return res.status(400).json({
        message: "Já foi registrado a saída para almoço para este dia",
      });
    }

    const presenca = await presencaModel.registrarAlmocoSaida(
      presencaDia.id,
      dateAtual
    );

    res.status(200).json({ message: "Saida para almoço Realizada", presenca });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao registrar almoço", error });
  }
};

const registrarAlmocoVolta = async (req, res) => {
  const usuarioId = parseInt(req.params.id);
  const dateAtual = horarioDeBrasilia();
  try {
    const presencaDia = await presencaModel.buscarRegistroDia(
      usuarioId,
      dateAtual
    );

    if (!presencaDia || !presencaDia.entrada) {
      return res
        .status(400)
        .json({ message: "Não foi registrado presença para esse dia" });
    }

    if (!presencaDia.almocoSaida) {
      return res
        .status(400)
        .json({ message: "Não foi registrado saida para almoço" });
    }

    if (presencaDia.almocoVolta) {
      return res
        .status(400)
        .json({ message: "Já foi registrado a volta do almoço para este dia" });
    }

    const presenca = await presencaModel.registrarAlmocoVolta(
      presencaDia.id,
      dateAtual
    );

    res.status(200).json({ message: "Volta do almoço Realizada", presenca });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao registrar volta do almoço", error });
  }
};

const registrarCheckout = async (req, res) => {
  const usuarioId = parseInt(req.params.id);
  const dateAtual = horarioDeBrasilia();
  try {
    const presencaDia = await presencaModel.buscarRegistroDia(
      usuarioId,
      dateAtual
    );

    if (!presencaDia || !presencaDia.entrada) {
      return res
        .status(400)
        .json({ message: "Não foi registrado presença para esse dia" });
    }

    if (!presencaDia.almocoSaida || !presencaDia.almocoVolta) {
      return res
        .status(400)
        .json({ message: "Não foram registrados horarios de almoço" });
    }

    if (presencaDia.saida) {
      return res
        .status(400)
        .json({ message: "Já foi registrado checkout para este dia" });
    }

    const horasTotais = calcularHorasTrabalhadas(
      presencaDia.entrada,
      presencaDia.almocoSaida,
      presencaDia.almocoVolta,
      dateAtual
    );

    const presenca = await presencaModel.registrarCheckout(
      presencaDia.id,
      dateAtual,
      `${horasTotais.horas}:${horasTotais.minutos}`
    );

    res.status(200).json({ message: "Checkout Realizado", presenca });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao registrar checkout", error });
  }
};

const ultimasPresencas = async (req, res) => {
  const quantidade = parseInt(req.params.quantidade);
  try {
    if (quantidade > 100) {
      return res.status(400).json({
        message:
          "quantidade inserida maior que a capacidade permitida para pesquisa",
      });
    }

    const resposta = await presencaModel.ultimasPresencas(quantidade);

    if (!resposta || resposta.length === 0) {
      return res.status(400).json({ message: "Nenhuma presença registrada" });
    }

    res.status(200).json(resposta);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar presenças", error });
  }
};



// Funções Privadas
const horarioDeBrasilia = () => {
  const hoje = new Date();
  const fusoBrasilia = hoje.getHours() - 3;
  hoje.setHours(
    fusoBrasilia,
    hoje.getMinutes(),
    hoje.getSeconds(),
    hoje.getMilliseconds()
  );

  return hoje;
};

const calcularHorasTrabalhadas = (chegada, almoco, voltaAlmoco, saida) => {
  const calcularDiferenca = (inicial, final) => {
    const diffMs =
      new Date("1970-01-01T" + final + "Z") -
      new Date("1970-01-01T" + inicial + "Z");
    const horas = Math.floor(diffMs / (1000 * 60 * 60));
    const minutos = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return { horas, minutos };
  };

  const formatarHora = (data) => {
    const horas = data.getHours().toString().padStart(2, "0");
    const minutos = data.getMinutes().toString().padStart(2, "0");
    return `${horas}:${minutos}`;
  };

  const chegadaFormatada = formatarHora(chegada);
  const almocoFormatado = formatarHora(almoco);
  const voltaAlmocoFormatada = formatarHora(voltaAlmoco);
  const saidaFormatada = formatarHora(saida);

  const antesAlmoco = calcularDiferenca(chegadaFormatada, almocoFormatado);
  const depoisAlmoco = calcularDiferenca(voltaAlmocoFormatada, saidaFormatada);

  const totalHoras =
    antesAlmoco.horas +
    depoisAlmoco.horas +
    Math.floor((antesAlmoco.minutos + depoisAlmoco.minutos) / 60);
  const totalMinutos = (antesAlmoco.minutos + depoisAlmoco.minutos) % 60;

  return { horas: totalHoras, minutos: totalMinutos };
};

module.exports = {
  registrarCheckin,
  registrarCheckout,
  registrarAlmocoSaida,
  registrarAlmocoVolta,
  ultimasPresencas,
};
