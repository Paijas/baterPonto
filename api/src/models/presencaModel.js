const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const registrarPresenca = async (data) => {
  return await prisma.presenca.create({ data });
};

module.exports = {registrarPresenca};
