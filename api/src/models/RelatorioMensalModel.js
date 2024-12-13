const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const gerarRelatorioMesUser = async (usuarioId, mes) => {
  // Determina o intervalo de datas para o mês
  // mes = '2024-12'
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

  // Calcula o total de horas trabalhadas
  let horasTotais = 0;

  presencas.forEach((presenca) => {
    if (presenca.entrada && presenca.saida) {
      const entrada = new Date(presenca.entrada);
      const saida = new Date(presenca.saida);

      // Subtrai horário de almoço, se houver
      let horasTrabalhadas = (saida - entrada) / (1000 * 60 * 60); // Em horas
      if (presenca.almocoSaida && presenca.almocoVolta) {
        const almocoSaida = new Date(presenca.almocoSaida);
        const almocoVolta = new Date(presenca.almocoVolta);
        horasTrabalhadas -= (almocoVolta - almocoSaida) / (1000 * 60 * 60);
      }

      // Adiciona ao total
      horasTotais += horasTrabalhadas;
    }
  });
  // Arredonda para 2 casas decimais
  horasTotais = Math.round(horasTotais * 100) / 100;

  const relatorioExistente = await prisma.relatorioMensal.findFirst({
    where: {
      usuarioId,
      mes,
    },
  });

  if (relatorioExistente) {
    // Atualiza o relatório existente
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
  return relatorio;
};

const gerarRelatorioMesGeral = async (mes) => {
  const dataInicio = new Date(`${mes}-01T00:00:00.000Z`);
  const dataFim = new Date(dataInicio);
  dataFim.setMonth(dataFim.getMonth() + 1);

  const usuarios = await prisma.usuario.findMany();
  const relatorios = [];

  for (const usuario of usuarios) {
    console.log(
      `Gerando relatório para o usuário: ${usuario.nome} (ID: ${usuario.id})`
    );

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
        if (presenca.almocoSaida && presenca.almocoVolta) {
          const almocoSaida = new Date(presenca.almocoSaida);
          const almocoVolta = new Date(presenca.almocoVolta);
          horasTrabalhadas -= (almocoVolta - almocoSaida) / (1000 * 60 * 60);
        }

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
      console.log(`Relatório atualizado para o usuário: ${usuario.nome}`);
    } else {
      relatorio = await prisma.relatorioMensal.create({
        data: {
          usuarioId: usuario.id,
          mes,
          horasTrabalhadas: horasTotais,
        },
      });
      console.log(`Relatório criado para o usuário: ${usuario.nome}`);
    }

    relatorios.push(relatorio); // Adiciona o relatório à lista
  }

  console.log("Todos os relatórios foram processados.");
  return relatorios;
};

const getRelatorioUser = async (usuarioId, mes) => {
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
    include:{
      usuario:{
        select:{
          nome: true,
        },
      },
    },
  });

  return presencas;
};

module.exports = { gerarRelatorioMesUser, gerarRelatorioMesGeral, getRelatorioUser };
