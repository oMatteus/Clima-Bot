const routes = require('./routes.cjs')

const express = require('express');
const cors = require('cors');

//Express
const app = express();
app.use(cors());
app.use(routes);
app.listen(3334);

console.log('');
console.log('Servidor iniciado');
console.log('http://localhost:3334');