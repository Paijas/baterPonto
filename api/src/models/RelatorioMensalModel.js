const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// const existeRelatorio = async (usuarioId, mes) => {
//   return await prisma.relatorioMensal.findFirst({
//     where: { usuarioId: usuarioId, mes: mes },
//   });
// };

const gerarRelatorioMensalUsuario = async (usuarioId, mes) => {
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

const gerarRelatoriosMensaisParaTodosUsuarios = async (mes) => {
  const dataInicio = new Date(`${mes}-01T00:00:00.000Z`);
  const dataFim = new Date(dataInicio);
  dataFim.setMonth(dataFim.getMonth() + 1);

  const usuarios = await prisma.usuario.findMany();

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

    if (relatorioExistente) {
      await prisma.relatorioMensal.update({
        where: {
          id: relatorioExistente.id,
        },
        data: {
          horasTrabalhadas: horasTotais,
        },
      });
    } else {
      await prisma.relatorioMensal.create({
        data: {
          usuarioId: usuario.id,
          mes,
          horasTrabalhadas: horasTotais,
        },
      });
    }
  }
};

module.exports = { gerarRelatorioMensalUsuario, gerarRelatoriosMensaisParaTodosUsuarios };
