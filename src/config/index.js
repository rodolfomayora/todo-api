const ports = {
  production: 3000,
  development: 3001,
  testing: 3002
}

const ENV = process.env.NODE_ENV;
const PORT = ports[ENV];

module.exports = { ENV, PORT };