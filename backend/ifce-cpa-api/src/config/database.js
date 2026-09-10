const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const { initializeApp: initClientApp } = require('firebase/app');
const { getAuth: getClientAuth } = require('firebase/auth');

const PROJECT_ID = 'cpa-ifce-db';

function carregarCredencial(envVar, caminhoFallback) {
  if (process.env[envVar]) {
    return JSON.parse(process.env[envVar]);
  }
  return require(caminhoFallback);
}

// --- Admin SDK (acesso total, usado no Firestore e verificação de token) ---
const serviceAccountPrincipal = carregarCredencial('FIREBASE_SERVICE_ACCOUNT', '../../serviceAccountKey.json');
const serviceAccountLogs = carregarCredencial('FIREBASE_LOGS_SERVICE_ACCOUNT', '../../serviceAccountLogsKey.json');

const appPrincipal = initializeApp({ credential: cert(serviceAccountPrincipal), projectId: PROJECT_ID }, 'principal');
const appLogs = initializeApp({ credential: cert(serviceAccountLogs), projectId: serviceAccountLogs.project_id }, 'logs');

const dbPrincipal = getFirestore(appPrincipal);
const dbLogs = getFirestore(appLogs);
const authPrincipal = getAuth(appPrincipal); // usado pelo authMiddleware (verifyIdToken)

// --- Client SDK (usado só pra login com email/senha) ---
const clientConfig = {
  apiKey: process.env.FIREBASE_CLIENT_API_KEY,
  authDomain: process.env.FIREBASE_CLIENT_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_CLIENT_PROJECT_ID,
};
const clientApp = initClientApp(clientConfig, 'client-login');
const clientAuth = getClientAuth(clientApp);

module.exports = { dbPrincipal, dbLogs, authPrincipal, clientAuth };