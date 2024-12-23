require("dotenv").config({ path: ".env" });
const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:8081",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const usuarioRoutes = require("./src/routes/usuarioRoute");
const presencaRoutes = require("./src/routes/presencaRoute");
const relatorioRoutes = require("./src/routes/relatorioRoute");

app.use("/usuario", usuarioRoutes);
app.use("/presenca", presencaRoutes);
app.use("/relatorio", relatorioRoutes);

const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

const cronServices = require("./src/services/cronServices");
cronServices.gerarRelatorio();

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
