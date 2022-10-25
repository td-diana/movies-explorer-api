const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes/routes');
const { handleError } = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cors());

app.use(bodyParser.json());

app.use(requestLogger); // подключаем логгер запросов
app.use(router);
app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());
app.use(handleError);

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.listen(PORT);
