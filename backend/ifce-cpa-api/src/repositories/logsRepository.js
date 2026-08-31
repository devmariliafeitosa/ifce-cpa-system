const { dbLogs } = require('../config/database');
const { FieldValue } = require('firebase-admin/firestore');

const logsCollection = dbLogs.collection('logs');

async function adicionarAcao(userId, textoAcao) {
  const docRef = logsCollection.doc(userId);
  const doc = await docRef.get();

  if (!doc.exists) {
    await docRef.set({
      actions: [textoAcao],
      createdAt: FieldValue.serverTimestamp(),
      updateAt: FieldValue.serverTimestamp(),
    });
  } else {
    await docRef.update({
      actions: FieldValue.arrayUnion(textoAcao),
      updateAt: FieldValue.serverTimestamp(),
    });
  }
}

async function buscarLogsPorUsuario(userId) {
  const doc = await logsCollection.doc(userId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

module.exports = { adicionarAcao, buscarLogsPorUsuario };