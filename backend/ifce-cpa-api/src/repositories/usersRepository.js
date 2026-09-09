const { dbPrincipal } = require('../config/database');

const usersCollection = dbPrincipal.collection('users');

async function criarUsuario(dados) {
  const docRef = usersCollection.doc(); // gera id aleatório
  await docRef.set(dados);
  return docRef.id;
}

async function buscarUsuarioPorId(userId) {
  const doc = await usersCollection.doc(userId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function atualizarUsuario(userId, dados) {
  await usersCollection.doc(userId).update(dados);
}

async function listarUsuarios() {
  const snapshot = await usersCollection.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function buscarUsuarioPorEmail(email) {
  const snapshot = await usersCollection
    .where('email', '==', email)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];

  return {
    id: doc.id,
    ...doc.data(),
  };
}

module.exports = { criarUsuario, buscarUsuarioPorId, atualizarUsuario, listarUsuarios, buscarUsuarioPorEmail };