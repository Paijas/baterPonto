const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const existeUser = async (login) =>{
  return await prisma.usuario.findFirst({
    where: {login: login}
  })
}

const buscarUser = async (id) => {
  return await prisma.usuario.findUnique({
    where: { id: id },
  });
};

const createUser = async (login, senha, nome, tipo) => {
  return await prisma.usuario.create({ 
    data:{
      login: login,
      senha: senha,
      nome: nome,
      tipo: tipo
    }
  });
};

module.exports = { createUser, buscarUser, existeUser };
