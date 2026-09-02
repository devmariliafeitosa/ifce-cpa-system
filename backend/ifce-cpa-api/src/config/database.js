const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

function carregarCredencial(envVar, caminhoFallback) {
  if (process.env[envVar]) {
    try {
      return JSON.parse(process.env[envVar]);
    } catch (err) {
      console.error(`Erro ao parsear JSON da variável ${envVar}:`, err.message);
    }
  }
  // Fallback para desenvolvimento local
  return require(caminhoFallback);
}

// Credenciais dos projetos
const serviceAccountPrincipal = carregarCredencial(
  'FIREBASE_SERVICE_ACCOUNT',
  '../../serviceAccountKey.json'
);

// Tenta carregar o banco de logs; se não existir o segundo JSON localmente, usa a principal para não travar o dev
let serviceAccountLogs;
try {
  serviceAccountLogs = carregarCredencial(
    'FIREBASE_LOGS_SERVICE_ACCOUNT',
    '../../serviceAccountLogsKey.json'
  );
} catch (e) {
  console.warn('⚠️ serviceAccountLogsKey.json não encontrado. Usando a chave principal para os logs.');
  serviceAccountLogs = serviceAccountPrincipal;
}

// Inicializa os apps do Firebase com a função modular 'cert'
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

// Instâncias do Firestore
const dbPrincipal = getFirestore(appPrincipal);
const dbLogs = getFirestore(appLogs);

module.exports = { dbPrincipal, dbLogs };