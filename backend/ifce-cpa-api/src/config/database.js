const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const path = require('node:path');

function carregarCredencial(envVar, caminhoFallback) {
  if (process.env[envVar]) {
    return JSON.parse(process.env[envVar]);
  }

  return require(caminhoFallback);
}

const serviceAccount = carregarCredencial(
  'FIREBASE_SERVICE_ACCOUNT',
  path.resolve(__dirname, '../../serviceAccountKey.json')
);

const appPrincipal = initializeApp(
  {
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  },
  "principal"
);

const dbPrincipal = getFirestore(appPrincipal);

// Por enquanto os logs ficam no mesmo Firestore.
const dbLogs = dbPrincipal;

// Firebase Authentication usado pelo backend.
const authPrincipal = getAuth(appPrincipal);

module.exports = {
  dbPrincipal,
  dbLogs,
  authPrincipal,
};