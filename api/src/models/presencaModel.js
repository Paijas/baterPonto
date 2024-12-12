const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const buscarRegistroDia = async (usuarioId, dateAtual) => {
  // Ajusta as horas de dateAtual para o final do dia (23:59:59.999)
  const dataFim = new Date(dateAtual);
  dataFim.setHours(23, 59, 59, 999);
  
  // A conversão para UTC é importante para garantir que estamos comparando datas no mesmo fuso horário
  const dateAtualUtc = new Date(Date.UTC(dateAtual.getFullYear(), dateAtual.getMonth(), dateAtual.getDate(), 0, 0, 0, 0));
  const dataFimUtc = new Date(Date.UTC(dataFim.getFullYear(), dataFim.getMonth(), dataFim.getDate(), 23, 59, 59, 999));
  // console.log("Date Atual UTC:", dateAtualUtc);
  // console.log("Data Fim UTC:", dataFimUtc);

  return await prisma.presenca.findFirst({
    where: {
      usuarioId: usuarioId,
      data: {
        gte: dateAtualUtc,
        lte: dataFimUtc,
      },
    },
  });
};

const registrarCheckin = async (usuarioId, dateAtual) => {
  return await prisma.presenca.create({
    data: {
      usuarioId,
      data: dateAtual,
      entrada: dateAtual,
      saida: null,
      almocoSaida: null,
      almocoVolta: null,
      horasTrabalhadasDia: null,
    },
  });
};
const registrarAlmocoSaida = async (registroId, dateAtual) => {
  return await prisma.presenca.update({
    where: { id: registroId },
    data: {
      almocoSaida: dateAtual,
    },
  });
};
const registrarAlmocoVolta = async (registroId, dateAtual) => {
  return await prisma.presenca.update({
    where: { id: registroId },
    data: {
      almocoVolta: dateAtual,
    },
  });
};
const registrarCheckout = async (registroId, dateAtual, horasTrabalhadas) => {
  return await prisma.presenca.update({
    where: { id: registroId },
    data: {
      saida: dateAtual,
      horasTrabalhadasDia: horasTrabalhadas,
    },
  });
};

module.exports = {
  registrarCheckin,
  registrarCheckout,
  registrarAlmocoSaida,
  registrarAlmocoVolta,
  buscarRegistroDia,
};
