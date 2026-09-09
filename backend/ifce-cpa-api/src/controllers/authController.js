import authService from "../services/authService.js";

class AuthController {
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ mensagem: "E-mail e senha são obrigatórios." });
      }

      const resultado = await authService.loginAluno(email, senha);

      return res.status(200).json({
        mensagem: "Login realizado com sucesso!",
        usuario: resultado
      });

    } catch (error) {
      if (error.message === "ALUNO_NOT_FOUND") {
        return res.status(403).json({ 
          mensagem: "Acesso negado: Este e-mail não pertence a um aluno cadastrado." 
        });
      }

      if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found") {
        return res.status(401).json({ 
          mensagem: "Credenciais inválidas. Verifique seu e-mail e senha." 
        });
      }

      return res.status(500).json({ 
        mensagem: "Erro interno no servidor ao tentar autenticar.",
        detalhes: error.message 
      });
    }
  }
}

export default new AuthController();