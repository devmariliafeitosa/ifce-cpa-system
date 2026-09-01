const { dbLogs } = require('../config/database');
const { FieldValue } = require('firebase-admin/firestore');

const logsCollection = dbLogs.collection('logs');

async function adicionarAcao(userId, textoAcao) {
  if (!userId || typeof userId !== 'string' || !userId.trim()) {
    throw new Error('Invalid userId: must be non-empty string');
  }
  
  if (!textoAcao || typeof textoAcao !== 'string' || !textoAcao.trim()) {
    throw new Error('Invalid textoAcao: must be non-empty string');
  }
  
  const docRef = logsCollection.doc(userId);
  const doc = await docRef.get();

  if (!doc.exists) {
    await docRef.set({
      userId,
      actions: [textoAcao],
      actionsCount: 1,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  } else {
    const currentCount = doc.data().actionsCount || 0;
    await docRef.update({
      actions: FieldValue.arrayUnion(textoAcao),
      actionsCount: currentCount + 1,
      updatedAt: FieldValue.serverTimestamp(),
    });
  }
}

async function buscarLogsPorUsuario(userId) {
  if (!userId || typeof userId !== 'string' || !userId.trim()) {
    throw new Error('Invalid userId: must be non-empty string');
  }
  
  const doc = await logsCollection.doc(userId).get();
  if (!doc.exists) return null;
  
  const data = doc.data();
  return { 
    id: doc.id, 
    userId: data.userId,
    actions: data.actions || [],
    actionsCount: data.actionsCount || 0,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

async function buscarTodosLogs() {
  const snapshot = await logsCollection.get();
  if (snapshot.empty) return [];
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return { 
      id: doc.id, 
      userId: data.userId,
      actions: data.actions || [],
      actionsCount: data.actionsCount || 0,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  });
}

module.exports = { adicionarAcao, buscarLogsPorUsuario, buscarTodosLogs };