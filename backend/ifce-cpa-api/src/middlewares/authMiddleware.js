const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
	const header = req.get('authorization');
	const token = header && header.startsWith('Bearer ') ? header.slice(7) : null;

	if (!token) return res.status(401).json({ error: 'Auth Token not informed' });

	try {
		req.user = jwt.verify(token, process.env.JWT_SECRET);
		return next();
	} catch (error) {
		return res.status(401).json({ error: 'Auth Token invalid' });
	}
}

function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Access only for Admin' });
	return next();
}

function requireOwnerOrAdmin(req, res, next) {
	const userId = req.user && (req.user.uid || req.user.id || req.user.userId);
	if ((!req.user || req.user.role !== 'admin') && userId !== req.params.userId) {
		return res.status(403).json({ error: 'You can only consult your own log' });
	}
	return next();
}

function exigirRole(...rolesPermitidas) {
  return (req, res, next) => {
    if (!req.user) {
      const erro = new Error('Não autenticado');
      erro.status = 401;
      return next(erro);
    }

    const temPermissao = req.user.roles?.some((role) => rolesPermitidas.includes(role));
    if (!temPermissao) {
      const erro = new Error('Sem permissão para essa ação');
      erro.status = 403;
      return next(erro);
    }

    next();
  };
}

module.exports = { authenticate, requireAdmin, requireOwnerOrAdmin, exigirRole };
