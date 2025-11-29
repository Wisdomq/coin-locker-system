require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { initDb } = require('./models');

const paymentsRouter = require('./api/payments');
const lockerRouter = require('./api/lockers/locker.router');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// init DB (non-blocking)
initDb().then(() => console.log('DB initialized')).catch(e => console.error('DB init error', e));

app.use('/api/payments', paymentsRouter);
app.use('/api/lockers', lockerRouter);

app.get('/', (req, res) => res.send('Coin Locker Backend'));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend running on port ${port}`));
