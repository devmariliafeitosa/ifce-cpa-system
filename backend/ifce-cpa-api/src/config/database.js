const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

function carregarCredencial(envVar, caminhoFallback) {
  if (process.env[envVar]) {
    return JSON.parse(process.env[envVar]);
  }
  // fallback pra desenvolvimento local
  return require(caminhoFallback);
}

// Credenciais dos dois projetos
const serviceAccountPrincipal = carregarCredencial(
  'FIREBASE_SERVICE_ACCOUNT',
  '../../serviceAccountKey.json'
);

const serviceAccountLogs = carregarCredencial(
  'FIREBASE_LOGS_SERVICE_ACCOUNT',
  '../../serviceAccountLogsKey.json'
);


const appPrincipal = initializeApp(
  {
    credential: cert(serviceAccountPrincipal),
    projectId: serviceAccountPrincipal.project_id,
  },
  'principal'
);

const appLogs = initializeApp(
  {
    credential: cert(serviceAccountLogs),
    projectId: serviceAccountLogs.project_id,
  },
  'logs'
);

const dbPrincipal = getFirestore(appPrincipal);
const dbLogs = getFirestore(appLogs);

module.exports = { dbPrincipal, dbLogs };