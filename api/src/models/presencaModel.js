const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const buscarPresencaDia = async (usuarioId, dateAtual) => {
  // Ajusta as horas de dateAtual para o final do dia (23:59:59.999)
  const dataFim = new Date(dateAtual);
  dataFim.setHours(23, 59, 59, 999);
  
  // A conversão para UTC é importante para garantir que estamos comparando datas no mesmo fuso horário
  const dateAtualUtc = new Date(Date.UTC(dateAtual.getFullYear(), dateAtual.getMonth(), dateAtual.getDate(), 0, 0, 0, 0));
  const dataFimUtc = new Date(Date.UTC(dataFim.getFullYear(), dataFim.getMonth(), dataFim.getDate(), 23, 59, 59, 999));

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
      horasTrabalhadasDia: "0:0",
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

const ultimasPresencas = async ( quantidade ) =>{
  return await prisma.presenca.findMany({
    orderBy:{
      entrada: 'desc'
    },
    include:{
      usuario:{
        select:{
          nome: true,
        }
      }
    },
    take: quantidade,
  })
}

const getPresencasUserMes = async (usuarioId, mes) => {
  const dataInicio = new Date(`${mes}-01T00:00:00.000Z`);
  const dataFim = new Date(dataInicio);
  dataFim.setMonth(dataFim.getMonth() + 1);

  const presencas = await prisma.presenca.findMany({
    where: {
      usuarioId,
      data: {
        gte: dataInicio,
        lt: dataFim,
      },
    },
    include: {
      usuario: {
        select: {
          nome: true,
        },
      },
    },
  });

  return presencas;
};


module.exports = {
  registrarCheckin,
  registrarCheckout,
  buscarPresencaDia,
  getPresencasUserMes,
  ultimasPresencas,
};
