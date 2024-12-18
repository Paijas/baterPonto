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
function gerarGrafico() {
  const QuickChart = require("quickchart-js");
  const dados = [
    { mes: "Janeiro", horas_trabalhadas: 160 },
    { mes: "Fevereiro", horas_trabalhadas: 100 },
    { mes: "Março", horas_trabalhadas: 170 },
    { mes: "Abril", horas_trabalhadas: 150 },
    { mes: "Maio", horas_trabalhadas: 160 },
    { mes: "Junho", horas_trabalhadas: 140 },
    { mes: "Julho", horas_trabalhadas: 150 },
    { mes: "Agosto", horas_trabalhadas: 160 },
    { mes: "Setembro", horas_trabalhadas: 155 },
    { mes: "Outubro", horas_trabalhadas: 165 },
    { mes: "Novembro", horas_trabalhadas: 170 },
    { mes: "Dezembro", horas_trabalhadas: 180 },
  ];

  const labels = dados.map((d) => d.mes);
  const valores = dados.map((d) => d.horas_trabalhadas);

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
    },
  });

  // Salva o gráfico corrigido
  chart.toFile("grafico.png").then(() => {
    console.log("Gráfico salvo");
  });
}
//...........PDF............

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const userModel = require("./src/models/usuarioModel");
const presencaModel = require("./src/models/presencaModel");

async function gerarRelatorioAno() {
  // Caminho absoluto da imagem local
  const imagePath = path.resolve(__dirname, "grafico.png");

  // Converte a imagem para Base64
  const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });
  const imageDataURI = `data:image/png;base64,${imageBase64}`;

  // Informações do funcionário

  const user = await userModel.buscarUser(
    "c474ee1c-e38a-46fc-aac4-98f72aef5377"
  );

  const employeeName = user.nome;
  const position = user.tipo;

  // Inicializa o navegador
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

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
        .image-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 20px 0;
        }
        img {
          max-width: 500px;
          height: auto;
        }
        .summary {
          font-size: 14px;
          margin-top: 20px;
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
      <h1>Relatório de Horas Trabalhadas</h1>

      <!-- Informações do Funcionário -->
      <div class="employee-info">
        <p><strong>Nome:</strong> ${employeeName}</p>
        <p><strong>Cargo:</strong> ${position}</p>
      </div>

      <!-- Gráfico -->
      <div class="section-title">Gráfico de Horas Trabalhadas</div>
      <div class="image-container">
        <img src="${imageDataURI}" alt="Gráfico de Horas Trabalhadas" />
      </div>

      <!-- Resumo -->
      <div class="section-title">Resumo</div>
      <div class="summary">
        <p>O funcionário <strong>${employeeName}</strong> trabalhou um total de <strong> 160 </strong>. Todas as horas foram devidamente registradas e analisadas, conforme o gráfico acima.</p>
        <p>Para mais detalhes, consulte o departamento de RH.</p>
      </div>

      <!-- Rodapé -->
      <div class="footer">
        <p>Relatório gerado automaticamente em ${new Date().toLocaleDateString()}.</p>
      </div>
    </body>
  </html>
`;

  // Define o conteúdo da página
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  // Gera o PDF
  await page.pdf({
    path: "relatorio.pdf",
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  console.log("Relatório gerado com sucesso!");
}

async function gerarRelatorioMes(userId, mes) {
  const user = await userModel.buscarUser(userId);
  const presenca = await presencaModel.getPresencasUserMes(user.id, mes);

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
      <h1>Relatório de Presença</h1>

      <!-- Informações do Funcionário -->
      <div class="employee-info">
        <p><strong>Nome:</strong> ${user.nome}</p>
        <p><strong>Cargo:</strong> ${user.tipo}</p>
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
          <p>No mês de <strong>${monthName}</strong> o funcionário <strong>${user.nome}</strong> trabalhou um total de <strong> ${formatHoursToString(totalHoras)}</strong>.</p>
          <p>${totalHoras > 220 ? "E possui " + formatHoursToString(220 - totalHoras) + " de horas extras" : "E está devendo " + formatHoursToString(220 - totalHoras * -1)}</p>
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
// gerarRelatorioAno();
gerarRelatorioMes("c474ee1c-e38a-46fc-aac4-98f72aef5377","2024-12");
