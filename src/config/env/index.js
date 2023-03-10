const ports = {
  default: 3000,
  production: 3001,
  development: 3002,
  testing: 3003
}

const ENV = process.env.NODE_ENV;
const IS_PRODUCTION  = ENV === 'production';
const IS_DEVELOPMENT = ENV === 'development';
const IS_TESTING     = ENV === 'testing';
const PORT = process.env.PORT ?? ports[ENV] ?? ports.default;

module.exports = {
  ENV,
  IS_PRODUCTION,
  IS_DEVELOPMENT,
  IS_TESTING,
  PORT,
};