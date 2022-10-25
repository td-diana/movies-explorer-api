const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const router = require('./routes/routes');
const { handleError } = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const app = express();
app.use(cors());
app.use(limiter);
app.use(bodyParser.json());

app.use(requestLogger); // подключаем логгер запросов
app.use(router);
app.use(helmet());
app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());
app.use(handleError);

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.listen(PORT);
