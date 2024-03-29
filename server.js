const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const db = require('./services/database');
const logger = require('./services/logger');
const { decode } = require('./middlewares/decodeToken');

const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');

const app = express();

const { port } = config;

const startServer = async () => {
  try {
    await db.initialize();

    app.use(express.json());
    app.use(cors());
    app.use(morgan('dev'));

    app.use('/user', userRoutes);
    app.use('/product', productRoutes);

    app.listen(port, () => {
      logger.info(`Server is running on port: ${port}`);
    });
  } catch (e) {
    logger.error(e);
  }
};

startServer();
