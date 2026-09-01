const { dbLogs } = require('../config/database');
const { FieldValue } = require('firebase-admin/firestore');

const logsCollection = dbLogs.collection('logs');

async function adicionarAcao(userId, textoAcao) {
  const docRef = logsCollection.doc(userId);
  const doc = await docRef.get();

  if (!doc.exists) {
    await docRef.set({
      userId,
      actions: [textoAcao],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  } else {
    await docRef.update({
      actions: FieldValue.arrayUnion(textoAcao),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }
}

async function buscarLogsPorUsuario(userId) {
  const doc = await logsCollection.doc(userId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function buscarTodosLogs() {
  const snapshot = await logsCollection.get();
  if (snapshot.empty) return [];
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

module.exports = { adicionarAcao, buscarLogsPorUsuario, buscarTodosLogs };