const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const buscarRegistroDia = async (usuarioId, data) => {
  return await prisma.presenca.findFirst({
    where: { usuarioId: usuarioId, data: data },
  });
};

const registrarCheckin = async (usuarioId, horas) => {
  return await prisma.presenca.create({
    data: {
      usuarioId,
      data: horas,
      entrada: horas,
      saida: null,
      almocoSaida: null,
      almocoVolta: null,
    },
  });
};
const registrarAlmocoSaida = async (registroId, horas) => {
  return await prisma.presenca.update({
    where: { id: registroId },
    data: {
      almocoSaida: horas,
    },
  });
};
const registrarAlmocoVolta = async (registroId, horas) => {
  return await prisma.presenca.update({
    where: { id: registroId },
    data: {
      almocoVolta: horas,
    },
  });
};
const registrarCheckout = async (registroId, horas) => {
  return await prisma.presenca.update({
    where: { id: registroId },
    data: {
      saida: horas,
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
