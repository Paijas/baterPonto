const cron = require("node-cron");
const presencaController = require("../controllers/presencaController");

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
      console.log("Gerando relatório mensal ...");
      presencaController.gerarRelatorioMesGeral(`${ano}-${mes}`);
    }
  });
};

module.exports = { gerarRelatorio };
