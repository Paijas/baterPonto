
const relatorioModel = require("./src/models/relatorioMensalModel");
const userModel = require("./src/models/usuarioModel");
const presencaModel = require("./src/models/presencaModel");

function formatarDiaSemana(data) {
  const diasDaSemana = [
    'domingo',
    'segunda-feira',
    'terça-feira',
    'quarta-feira',
    'quinta-feira',
    'sexta-feira',
    'sábado'
  ];
  const dataSemana = new Date(data);
  const diaDaSemana = dataSemana.getUTCDay();
  return diasDaSemana[diaDaSemana];
}

// Gerar Grafico
const gerarGrafico = async (usuarioId, ano) => {
  const QuickChart = require("quickchart-js");
  const relatorioAno = await relatorioModel.gerarRelatorioAnual(
    usuarioId,
    ano
  );

  const labels = relatorioAno.relatorioAnual.map((d) =>
    getMonthNameAndYear(d.mes).monthName
  );
  const valores = relatorioAno.relatorioAnual.map((d) => d.horasTrabalhadas);

  const chart = new QuickChart();
  chart.setConfig({
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Horas Trabalhadas",
          data: valores,
          borderWidth: 2,
          barPercentage: 0.8, // Ajusta a largura das barras
          categoryPercentage: 0.9,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        datalabels: {
          anchor: "end", // Posiciona o valor acima da barra
          align: "end", // Alinha o texto no final da barra
          font: {
            size: 12,
          },
          formatter: (value) => `${value}`, // Formata o valor exibido
        },
      },
    },
    plugins: ["chartjs-plugin-datalabels"], // Inclui o plugin
  });

  // Salva o gráfico de forma síncrona
  await chart.toFile("grafico.png");
  console.log("Gráfico salvo com sucesso!");
};
//...........PDF............

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");


async function gerarRelatorioAno(usuarioId, ano) {
  // Aguarda a geração do gráfico antes de prosseguir
  await gerarGrafico(usuarioId, ano);

  const relatorioAno = await relatorioModel.gerarRelatorioAnual(
    usuarioId,
    ano
  );

  
  const imgLogo = imageToB64("logo.png")
  const imgGrafico = imageToB64("grafico.png");


  const user = await userModel.buscarUser(usuarioId);

  const employeeName = user.nome;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const htmlContent = `
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        h1 { text-align: center; color: #004080; margin-bottom: 10px; }
        .employee-info { margin: 20px 0; font-size: 16px; line-height: 1.5; }
        .employee-info p { margin: 5px 0; }
        .section-title { font-size: 18px; font-weight: bold; color: #004080; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
        .image-container { display: flex; justify-content: center; align-items: center; margin: 20px 0; }
        .image-logo {img { max-width: 100px; height: auto; }}
        .image-grafico {img { max-width: 500px; height: auto; }}
        .summary { font-size: 14px; margin-top: 20px; }
        .footer { text-align: center; font-size: 12px; color: #777; margin-top: 40px; }
      </style>
    </head>
    <body>
      <div class="image-container image-logo">
        <img src="${imgLogo}" alt="Logo" />
      </div>
      <h1>Relatório de Horas Trabalhadas</h1>
      <div class="employee-info">
        <p><strong>Nome:</strong> ${employeeName}</p>
        <p><strong>Cargo:</strong> Médico</p>
      </div>
      <div class="section-title">Gráfico de Horas Trabalhadas</div>
      <div class="image-container image-grafico">
        <img src="${imgGrafico}" alt="Gráfico de Horas Trabalhadas" />
      </div>
      <div class="section-title">Resumo</div>
      <div class="summary">
        <p>No ano de <strong>${ano}</strong>, o/a funcionário/a <strong>${employeeName}</strong> trabalhou um total de <strong>${formatHoursToString(
    relatorioAno.totalHorasAnual
  )}</strong>. Todas as horas foram devidamente registradas e analisadas, conforme o gráfico acima.</p>
        <p>Para mais detalhes, consulte o departamento de RH.</p>
      </div>
      <div class="footer">
        <p>Relatório gerado automaticamente em ${new Date().toLocaleDateString()}.</p>
      </div>
    </body>
  </html>
  `;

  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  await page.pdf({
    path: "relatorio_anual.pdf",
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  console.log("Relatório gerado com sucesso!");
}


async function gerarRelatorioMes(userId, mes) {
  const horasNecessarias = 176;

  const user = await userModel.buscarUser(userId);
  const presenca = await presencaModel.getPresencasUserMes(userId, mes);

  const imgLogo = imageToB64("logo.png");

  if(!user || !presenca){
    console.log("Relatorio presença não encontrado")
    return 
  }
  const { monthName, year } = getMonthNameAndYear(mes);

  const horas = presenca.map((item) => item.horasTrabalhadasDia);
  const totalHoras = horas.reduce(
    (acumulador, valorAtual) => acumulador + valorAtual,
    0
  );
  const tableRows = presenca
    .map(
      (item) => `
      <tr>
        <td>${formatDateToDDMMYYYY(item.data)}</td>
        <td>${formatarDiaSemana(item.data)}</td>
        <td>${ item.horasTrabalhadasDia != 0 ? formatHoursToString(item.horasTrabalhadasDia) : "Não Bateu Ponto de Saída"}</td>
      </tr>`
    )
    .join("");

  // Conteúdo HTML do relatório
  const htmlContent = `
  <html>
    <head>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 40px;
          color: #333; 
        }
        h1 {
          text-align: center;
          color: #004080;
          margin-bottom: 10px;
        }
        .employee-info {
          margin: 20px 0;
          font-size: 16px;
          line-height: 1.5;
        }
        .employee-info p {
          margin: 5px 0;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #004080;
          margin-top: 30px;
          margin-bottom: 10px;
          border-bottom: 1px solid #ccc;
          padding-bottom: 5px;
        }
        .image-container { display: flex; justify-content: center; align-items: center; margin: 20px 0; }
        .image-logo {img { max-width: 100px; height: auto; }}
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: center;
        }
        th {
          background-color: #f2f2f2;
          color: #333;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #777;
          margin-top: 40px;
        }
      </style>
    </head>
    <body>
    <div class="image-container image-logo">
      <img src="${imgLogo}" alt="Logo" />
    </div>
      <h1>Relatório de Presença</h1>

      <!-- Informações do Funcionário -->
      <div class="employee-info">
        <p><strong>Nome:</strong> ${user.nome}</p>
        <p><strong>Cargo:</strong> Médico </p>
        <p><strong>Mês:</strong> ${monthName} de ${year}</p>
      </div>
      <!-- Tabela de Presença -->
      <div class="section-title">Lista de Presença</div>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Dia da Semana</th>
            <th>Horas Trabalhadas</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
      <div >
        <p>No mês de <strong>${monthName}</strong> o funcionário <strong>${user.nome}</strong> trabalhou um total de <strong> ${formatHoursToString(totalHoras)}</strong>
              ${totalHoras >= horasNecessarias
                ? `e possui <strong><span style="color: green;">${formatHoursToString(totalHoras - horasNecessarias)}</span></strong> de horas extras.`
                : `e está devendo <strong><span style="color: #9e1b24;">${formatHoursToString(horasNecessarias - totalHoras)}</span></strong>.`}
        </p>
        </div>
      <!-- Rodapé -->
      <div class="footer">
        <p>Relatório gerado automaticamente em ${new Date().toLocaleDateString()}.</p>
      </div>
    </body>
  </html>
`;

  // Inicializa o Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Define o conteúdo HTML
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  // Gera o PDF
  await page.pdf({
    path: "relatorio_presenca.pdf",
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  console.log("Relatório de presença gerado com sucesso!");
}

// Chama a função
// gerarRelatorioAno("c474ee1c-e38a-46fc-aac4-98f72aef5377");
gerarRelatorioMes("c474ee1c-e38a-46fc-aac4-98f72aef5377","2024-12");
gerarRelatorioAno("c474ee1c-e38a-46fc-aac4-98f72aef5377","2024");
// (async () => {
//   try {
//     await gerarRelatorioAno("c474ee1c-e38a-46fc-aac4-98f72aef5377", "2024");
//   } catch (error) {
//     console.error("Erro ao gerar o relatório:", error);
//   }
// })();
function formatDateToDDMMYYYY(isoDate) {
  const date = new Date(isoDate); // Converte a string em um objeto Date
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}
function formatHoursToString(hoursFloat) {
  const hours = Math.floor(hoursFloat); // Parte inteira: horas
  const minutes = Math.round((hoursFloat - hours) * 60); // Converte o decimal para minutos
  return `${hours} hora${hours !== 1 ? "s" : ""} e ${minutes} minuto${
    minutes !== 1 ? "s" : ""
  }`;
}
function getMonthNameAndYear(dateString) {
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const [year, month] = dateString.split("-"); // Divide a string em ano e mês
  const monthName = months[parseInt(month, 10) - 1]; // Converte mês para índice do array
  
  return { monthName, year };
}
function imageToB64(imagePath){
  const image = path.resolve(__dirname, imagePath);
  // Converte a imagem para Base64
  const imageBase64 = fs.readFileSync(image, { encoding: "base64" });
  return `data:image/png;base64,${imageBase64}`;
}