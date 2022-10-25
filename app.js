require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { limiter } = require('./utils/rateLimiter');
const router = require('./routes/routes');
const { handleError } = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { mongo } = require('./utils/config');

const { PORT = 3000, NODE_ENV, DATABASE_URL } = process.env;

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

mongoose.connect(NODE_ENV === 'production' ? DATABASE_URL : mongo);
// mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.listen(PORT);
