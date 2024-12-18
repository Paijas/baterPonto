const relatorioMensalModel = require("../models/relatorioMensalModel");
const usuarioModel = require("../models/usuarioModel");

const gerarRelatorioMesUser = async (req, res) => {
  const { usuarioId, mes } = req.body;
  const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
  try {
    if (!usuarioId) {
      return res.status(400).json({ message: "Insira um usuário" });
    }

    const buscarUser = await usuarioModel.buscarUser(usuarioId);
    if (!buscarUser){
      return res.status(404).json({ message: "Usuário não encontrado" });

    }

    if (!mes || !regex.test(mes)) {
      return res.status(400).json({ message: "Insira uma data válida" });
    }
    const relatorio = await relatorioMensalModel.gerarRelatorioMesUser(
      usuarioId,
      mes
    );
    res.status(200).json(relatorio);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao gerar relatório", error });
  }
};

const gerarRelatorioMesGeral = async (req, res) => {
  const { mes } = req.body;
  const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
  try {
    if (!mes || !regex.test(mes)) {
      return res.status(400).json({ message: "Insira uma data válida" });
    }
    const relatorio = await relatorioMensalModel.gerarRelatorioMesGeral(mes);
    res.status(200).json(relatorio);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao gerar relatório", error });
  }
};


module.exports = { gerarRelatorioMesUser, gerarRelatorioMesGeral };
