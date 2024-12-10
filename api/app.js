require("dotenv").config({ path: ".env" });
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const usuarioRoutes = require("./src/routes/usuarioRoute");
const presencaRoutes = require("./src/routes/presencaRoute");

app.use("/api/usuario", usuarioRoutes);
app.use("/api/presenca", presencaRoutes);
