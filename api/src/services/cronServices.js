const cron = require("node-cron");
const gerarRelatorioMensal = require("../controllers/");

// Meia noite '0 0 * * *'
// 10 segundos '*/10 * * * * *'
const gerarRelatorio = () => {
  cron.schedule("0 0 * * *", () => {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = agora.getMonth() + 1; // Janeiro = 0, por isso +1
    const dia = agora.getDate();

    const ultimoDia = new Date(ano, mes, 0).getDate();

    if (dia === ultimoDia) {
      console.log("Executando chamada de API programada...");
      gerarRelatorioMensal();
    }
  });
};

module.exports = { gerarRelatorio };
