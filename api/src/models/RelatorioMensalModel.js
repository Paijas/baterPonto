const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const horaAlmoco = 1;

const gerarRelatorioMesUser = async (usuarioId, mes) => {
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
  });

  let horasTotais = 0;

  presencas.forEach((presenca) => {
    if (presenca.entrada && presenca.saida) {
      const entrada = new Date(presenca.entrada);
      const saida = new Date(presenca.saida);
      let horasTrabalhadas = (saida - entrada) / (1000 * 60 * 60); // Em horas

      // Desconta 1 hora de almoço
      horasTrabalhadas = Math.max(horasTrabalhadas - horaAlmoco, 0);

      horasTotais += horasTrabalhadas;
    }
  });

  horasTotais = Math.round(horasTotais * 100) / 100;

  const relatorioExistente = await prisma.relatorioMensal.findFirst({
    where: {
      usuarioId,
      mes,
    },
  });

  let relatorio;
  if (relatorioExistente) {
    relatorio = await prisma.relatorioMensal.update({
      where: {
        id: relatorioExistente.id,
      },
      data: {
        horasTrabalhadas: horasTotais,
      },
    });
  } else {
    relatorio = await prisma.relatorioMensal.create({
      data: {
        usuarioId,
        mes,
        horasTrabalhadas: horasTotais,
      },
    });
  }

  const usuario = await prisma.usuario.findUnique({
    where: {
      id: usuarioId,
    },
    select: {
      nome: true,
    },
  });

  return { ...relatorio, nome: usuario.nome || "Usuário não encontrado" };
};

const gerarRelatorioMesGeral = async (mes) => {
  const dataInicio = new Date(`${mes}-01T00:00:00.000Z`);
  const dataFim = new Date(dataInicio);
  dataFim.setMonth(dataFim.getMonth() + 1);

  const usuarios = await prisma.usuario.findMany();
  const relatorios = [];
  const horaAlmoco = 1; // Define 1 hora de almoço

  for (const usuario of usuarios) {
    const presencas = await prisma.presenca.findMany({
      where: {
        usuarioId: usuario.id,
        data: {
          gte: dataInicio,
          lt: dataFim,
        },
      },
    });

    let horasTotais = 0;

    presencas.forEach((presenca) => {
      if (presenca.entrada && presenca.saida) {
        const entrada = new Date(presenca.entrada);
        const saida = new Date(presenca.saida);
        let horasTrabalhadas = (saida - entrada) / (1000 * 60 * 60); // Em horas

        // Desconta 1 hora de almoço
        horasTrabalhadas = Math.max(horasTrabalhadas - horaAlmoco, 0);

        horasTotais += horasTrabalhadas;
      }
    });

    horasTotais = Math.round(horasTotais * 100) / 100;

    const relatorioExistente = await prisma.relatorioMensal.findFirst({
      where: {
        usuarioId: usuario.id,
        mes,
      },
    });

    let relatorio;
    if (relatorioExistente) {
      relatorio = await prisma.relatorioMensal.update({
        where: {
          id: relatorioExistente.id,
        },
        data: {
          horasTrabalhadas: horasTotais,
        },
      });
    } else {
      relatorio = await prisma.relatorioMensal.create({
        data: {
          usuarioId: usuario.id,
          mes,
          horasTrabalhadas: horasTotais,
        },
      });
    }

    relatorios.push({
      ...relatorio,
      nome: usuario.nome,
    });
  }

  return relatorios;
};




module.exports = {
  gerarRelatorioMesUser,
  gerarRelatorioMesGeral,
};
