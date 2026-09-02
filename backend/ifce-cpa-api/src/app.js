require('dotenv').config();

const express = require('express');
const cors = require('cors');
const port = Number(process.env.PORT) || 3001;

// Certifique-se de ajustar os caminhos relativos de acordo com a estrutura do seu projeto
const logsRoutes = require('./routes/logsRoutes');
const formsRoutes = require('./routes/formsRoutes');
const { requestLogger } = require('./middlewares/requestLogger');

const app = express();

// Lê origens do .env (separadas por vírgula) ou usa o padrão Vite local
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.disable('x-powered-by');

app.use(express.json());

console.log('[CORS Debug] Origens permitidas no array:', allowedOrigins);

app.use(cors({ 
  origin: function (origin, callback) {
    console.log('[CORS Debug] Origem da requisição chegando:', origin);
    
    // Permite requisições sem origin (como Postman) ou requisições da lista
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`[CORS Blocked] A origem ${origin} não está no array allowedOrigins!`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Rota de Health Check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Rotas da API
app.use('/api/logs', logsRoutes);
app.use('/api/forms', formsRoutes);

// Tratamento de Erro: Payload JSON malformado
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ error: 'JSON inválido enviado no corpo da requisição.' });
  }
  return next(error);
});

// Tratamento de Erro Genérico
app.use((error, req, res, next) => {
  console.error('[Unhandled Error]:', error);
  return res.status(500).json({ error: 'Server Inner Error' });
});

module.exports = app;