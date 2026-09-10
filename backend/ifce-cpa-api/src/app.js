require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const questionsRoutes = require('./routes/questionsRoutes');
const logsRoutes = require('./routes/logsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const formsRoutes = require('./routes/formsRoutes');
const respostaFormsRoutes = require('./routes/respostaFormsRoutes');
const formQuestionsRoutes = require('./routes/formQuestionRoutes');
const campusesRoutes = require('./routes/campusesRoutes');

const { requestLogger } = require('./middlewares/requestLogger');

const app = express();

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN
      .split(',')
      .map((origin) => origin.trim())
  : [
      'http://localhost:3000',
      'http://localhost:5173',
    ];

app.disable('x-powered-by');

app.use(
  cors({
    origin: corsOrigins,
    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  })
);

app.use(express.json({ limit: '32kb' }));

app.use(requestLogger);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/forms', formsRoutes);
app.use('/api/respostaForms', respostaFormsRoutes);
app.use('/api/form-questions', formQuestionsRoutes);
app.use('/api/campuses', campusesRoutes);

app.use((error, req, res, next) => {
  if (
    error instanceof SyntaxError &&
    error.status === 400 &&
    error.body
  ) {
    return res.status(400).json({
      error: 'JSON inválido',
    });
  }

  return next(error);
});

app.use((error, req, res, next) => {
  console.error(error);

  return res.status(500).json({
    error: 'Server Inner Error',
  });
});

module.exports = app;