const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const registrarPresenca = async (usuarioId, dataAtual) => {
  return await prisma.presenca.create({
    data: {
      usuarioId,
      data: dataAtual,
      entrada: dataAtual,
      saida: null,
      almocoSaida: null,
      almocoVolta: null,
    },
  });
};

module.exports = { registrarPresenca };
