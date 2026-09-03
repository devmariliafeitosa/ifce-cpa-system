require('dotenv').config();

const questionsRoutes = require('./routes/questionsRoutes');
const express = require('express');
const cors = require('cors');
const logsRoutes = require('./routes/logsRoutes');
const { requestLogger } = require('./middlewares/requestLogger');

const app = express();
const corsOrigins = process.env.CORS_ORIGIN
	? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
	: false;

app.disable('x-powered-by');
app.use(cors({ origin: corsOrigins }));
app.use(express.json({ limit: '32kb' }));
app.use(requestLogger);

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/logs', logsRoutes);

app.use((error, req, res, next) => {
	if (error instanceof SyntaxError && error.status === 400 && error.body) {
		return res.status(400).json({ error: 'JSON inválido' });
	}
	return next(error);
});

app.use((error, req, res, next) => {
	console.error(error);
	return res.status(500).json({ error: 'Server Inner Error' });
});


app.use('/questions', questionsRoutes);

module.exports = app;
