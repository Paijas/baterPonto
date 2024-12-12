const presencaModel = require("../models/presencaModel");
const usuarioModel = require("../models/usuarioModel");

const registrarCheckin = async (req, res) => {
  const { usuarioId } = req.body;
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
    console.log(presencaDia)

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
  const { usuarioId } = req.body;
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

    if(presencaDia.almocoSaida){
      return res
        .status(400)
        .json({ message: "Já foi registrado a saída para almoço para este dia" });
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
  const { usuarioId } = req.body;
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

    if(presencaDia.almocoVolta){
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
  const { usuarioId } = req.body;
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
    
    if(presencaDia.saida){
      return res
        .status(400)
        .json({ message: "Já foi registrado checkout para este dia" });
    }

    // Retorna exemplo: 8:13
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

  return hoje;
};

const calcularHorasTrabalhadas = (chegada, almoco, voltaAlmoco, saida) => {
  // Função interna para calcular a diferença em horas e minutos
  const calcularDiferenca = (inicial, final) => {
    const diffMs =
      new Date("1970-01-01T" + final + "Z") -
      new Date("1970-01-01T" + inicial + "Z");
    const horas = Math.floor(diffMs / (1000 * 60 * 60));
    const minutos = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return { horas, minutos };
  };

  // Função para formatar o horário de um objeto Date para "HH:mm"
  const formatarHora = (data) => {
    const horas = data.getHours().toString().padStart(2, "0"); // Adiciona 0 se for menor que 10
    const minutos = data.getMinutes().toString().padStart(2, "0"); // Adiciona 0 se for menor que 10
    return `${horas}:${minutos}`;
  };

  // Formatando os horários (inputs no formato Date)
  const chegadaFormatada = formatarHora(chegada);
  const almocoFormatado = formatarHora(almoco);
  const voltaAlmocoFormatada = formatarHora(voltaAlmoco);
  const saidaFormatada = formatarHora(saida);

  // Calcular as diferenças antes e depois do almoço
  const antesAlmoco = calcularDiferenca(chegadaFormatada, almocoFormatado);
  const depoisAlmoco = calcularDiferenca(voltaAlmocoFormatada, saidaFormatada);

  // Somar horas e minutos
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
};
