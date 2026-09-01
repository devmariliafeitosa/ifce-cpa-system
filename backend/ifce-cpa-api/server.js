require('dotenv').config();

const app = require('./src/app');

const port = Number(process.env.PORT) || 3001;

app.listen(port, () => {
	console.log(`IFCE CPA API running on port ${port}`);
});
