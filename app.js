require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const routes = require('./routes/index.js');
const { requestLogger, errorLogger } = require('./logs/logger.js');
const { SERVER_ERROR } = require('./utils/errors');
const limiter = require('./utils/limiter');

const app = express();

const { PORT = 3000, MONGO_ADDRESS, NODE_ENV } = process.env;

app.use(requestLogger);
app.use(cors());
app.use(helmet());
// app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(NODE_ENV === 'production' ? MONGO_ADDRESS : 'mongodb://localhost:27017/diplom', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? SERVER_ERROR : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
