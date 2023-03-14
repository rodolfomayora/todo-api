const ports = {
  default    : 3000,
  production : 3001,
  development: 3002,
  testing    : 3003
}

const ENV            = process.env.NODE_ENV;
const PORT           = process.env.PORT ?? ports[ENV] ?? ports.default;
const MONGO_URI      = process.env.MONGO_URI;
const MONGO_USER     = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DBNAME   = process.env.MONGO_DBNAME;
const IS_PRODUCTION  = ENV === 'production';
const IS_DEVELOPMENT = ENV === 'development';
const IS_TESTING     = ENV === 'testing';

module.exports = {
  ENV,
  PORT,
  MONGO_URI,
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_DBNAME,
  IS_PRODUCTION,
  IS_DEVELOPMENT,
  IS_TESTING,
};