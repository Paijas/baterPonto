const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const existeUser = async (login) =>{
  return await prisma.usuario.findFirst({
    where: {login: login},
    select:{
      id: true,
      nome: true,
      tipo: true,
    },
  })
}

const buscarUser = async (id) => {
  return await prisma.usuario.findUnique({
    where: { id: id },
    select:{
      id: true,
      nome: true,
      tipo: true,
    },
  });
};

const getAllUsers = async () => {
  return await prisma.usuario.findMany({
    select:{
      id: true,
      nome: true,
      tipo: true,
    }
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

module.exports = { createUser, getAllUsers, buscarUser, existeUser };
