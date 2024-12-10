const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const existeUser = async (login) => {
  return await prisma.usuarios.findFirst({
    where: { login: login },
  });
};

const createUser = async (data) => {
  return await prisma.usuarios.create({ data });
};

module.exports = {createUser, existeUser};
