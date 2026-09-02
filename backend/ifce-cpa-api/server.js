require('dotenv').config();
const app = require('./src/app');

const port = Number(process.env.PORT) || 3001;

process.on('uncaughtException', (err) => {
  console.error('CRITICAL ERROR (Uncaught Exception):', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('CRITICAL ERROR (Unhandled Rejection):', reason);
});

const server = app.listen(port, () => {
  console.log(`IFCE CPA API running on port ${port}`);
});

// Mantém o Event Loop do Node ativo no Nodemon sem dar clean exit
const keepAlive = setInterval(() => {}, 1000000);

process.on('SIGINT', () => {
  clearInterval(keepAlive);
  server.close(() => process.exit(0));
});