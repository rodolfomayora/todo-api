const express = require('express');
const app = express();

app.use(express.json()); // to allow JSON entries
app.get('/api/v1', (reques, response) => {
  return response.status(200).json({ message: 'TODO RESTful API'});
})
app.use((request, response) => {
  return response
    .status(404)
    .json({ message: 'The resquested resource was not found on this server' });
})

module.exports = app;