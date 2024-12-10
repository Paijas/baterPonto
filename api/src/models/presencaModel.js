const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function registrarPresenca(data) {
  const presenca = await prisma.presenca.create({ data });
  console.log(presenca);
}

module.exports(registrarPresenca)
