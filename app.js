const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user');

const app = express();
const logger = require('./logger/app');

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(userRoutes);
app.use((error, req, res) => {
  const Status = error.status || 500;
  const Mesage = error.message;
  res.status(Status).json({ Sucess: false, Message: Mesage });
});
try {
  mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
} catch
(err) {
  logger.error(err);
}
app.listen('3001', () => {
  logger.info('Running on port 3001');
  logger.log('silly', "127.0.0.1 - there's no place like home1");
  logger.log('debug', "127.0.0.1 - there's no place like home2");
  logger.log('verbose', "127.0.0.1 - there's no place like home3");
  logger.log('info', "127.0.0.1 - there's no place like home4");
  logger.log('warn', "127.0.0.1 - there's no place like home5");
  logger.log('error', "127.0.0.1 - there's no place like home6");
  logger.info("127.0.0.1 - there's no place like home7");
  logger.warn("127.0.0.1 - there's no place like home8");
  logger.error("127.0.0.1 - there's no place like home9");
  logger.http("127.0.0.1 - there's no place like home9");
});
