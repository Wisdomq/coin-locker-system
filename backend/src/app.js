require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const paymentsRouter = require('./api/payments/payments.router');
const lockerRouter = require('./api/lockers/locker.router');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/payments', paymentsRouter);
app.use('/api/lockers', lockerRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend running on port ${port}`));
