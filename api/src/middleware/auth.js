const jwt = require("jsonwebtoken");

const middlewareAuth =
  (tipo = []) =>
  (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res
          .status(403)
          .json({ message: "Token não fornecido. Acesso negado." });
      }

      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res
            .status(403)
            .json({ message: "Token inválido ou expirado." });
        }

        if (tipo.length > 0 && !tipo.includes(user.tipo) && user.tipo !== "admin") {
          return res
            .status(403)
            .json({ message: "Usuário não autorizado para este recurso." });
        }

        next();
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao autenticar usuário", error });
    }
  };

module.exports = { middlewareAuth };
