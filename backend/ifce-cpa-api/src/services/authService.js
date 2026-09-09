const { signInWithEmailAndPassword, signOut } = require('firebase/auth');
const { clientAuth } = require('../config/database');
const usersRepository = require('../repositories/usersRepository');
const usersServices = require('./usersService');
const { registrarLog } = require('./logsService');

async function login(email, senha) {
  let userCredential;

  try {
    userCredential = await signInWithEmailAndPassword(clientAuth, email, senha);
  } catch (err) {
    console.error('Erro real do Firebase Auth:', err.code, err.message);
    const erro = new Error('Credenciais inválidas. Verifique seu e-mail e senha.');
    erro.status = 401;
    throw erro;
  }

  const firebaseUser = userCredential.user;

  const usuarioBasico = await usersRepository.buscarUsuarioPorEmail(firebaseUser.email);

  if (!usuarioBasico) {
    await signOut(clientAuth);
    const erro = new Error('Usuário autenticado no Firebase, mas não cadastrado no sistema.');
    erro.status = 403; 
    throw erro;
  }

  if (usuarioBasico.ativo === false) {
    await signOut(clientAuth);
    const erro = new Error('Usuário desativado.');
    erro.status = 403;
    throw erro;
  }

  // busca os dados completos, cruzando com as coleções de role (aluno/docente/servidor/coordenador)
  const usuarioCompleto = await usersServices.buscarUsuarioCompleto(usuarioBasico.id);

  const idToken = await firebaseUser.getIdToken();

  await registrarLog({
    userId: usuarioBasico.id,
    tipo: 'AUTH',
    descricao: 'fez login',
  });

  return {
    firebaseUid: firebaseUser.uid,
    idToken,
    usuario: usuarioCompleto,
  };
}

module.exports = { login };