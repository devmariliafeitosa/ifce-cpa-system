const { authPrincipal } = require('../config/database');
const usersRepository = require('../repositories/usersRepository');

async function authenticate(req, res, next) {
  const header = req.get('authorization');

  const token =
    header?.startsWith('Bearer ')
      ? header.slice(7)
      : null;

  if (!token) {
    return res.status(401).json({
      mensagem: 'Token de autenticação não informado.',
    });
  }

  let decodedToken;

  try {
    decodedToken = await authPrincipal.verifyIdToken(token);
  } catch (error) {
    console.error('Token Firebase inválido:', error.code);

    return res.status(401).json({
      mensagem: 'Token de autenticação inválido ou expirado.',
    });
  }

  try {
    if (!decodedToken.email) {
      return res.status(401).json({
        mensagem: 'Usuário autenticado não possui e-mail.',
      });
    }

    const usuario =
      await usersRepository.buscarUsuarioPorEmail(
        decodedToken.email
      );

    if (!usuario) {
      return res.status(403).json({
        mensagem:
          'Usuário autenticado no Firebase, mas não cadastrado no sistema.',
      });
    }

    if (usuario.ativo === false) {
      return res.status(403).json({
        mensagem: 'Usuário desativado.',
      });
    }

    req.user = {
      id: usuario.id,

      firebaseUid: decodedToken.uid,

      nome: usuario.nome,

      email: decodedToken.email,

      campusId: usuario.campusId,

      roles: usuario.roles || [],

      ativo: usuario.ativo,
    };

    return next();
  } catch (error) {
    return next(error);
  }
}

function requireAdmin(req, res, next) {
  const autorizado =
    req.user?.roles?.includes('coordenador') ||
    req.user?.roles?.includes('admin');

  if (!autorizado) {
    return res.status(403).json({
      mensagem: 'Acesso restrito.',
    });
  }

  return next();
}

function requireOwnerOrAdmin(req, res, next) {
  const userId = req.user?.id;

  const admin =
    req.user?.roles?.includes('coordenador')

  if (!admin && userId !== req.params.userId) {
    return res.status(403).json({
      mensagem: 'Sem permissão para acessar este recurso.',
    });
  }

  return next();
}

function exigirRole(...rolesPermitidas) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        mensagem: 'Não autenticado.',
      });
    }

    const temPermissao = req.user.roles?.some((role) =>
      rolesPermitidas.includes(role)
    );

    if (!temPermissao) {
      return res.status(403).json({
        mensagem: 'Sem permissão para essa ação.',
      });
    }

    return next();
  };
}

module.exports = {
  authenticate,
  requireAdmin,
  requireOwnerOrAdmin,
  exigirRole,
};