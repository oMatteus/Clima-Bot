const express = require('express');
const route = express.Router();

const climaController = require('./src/controllers/climaController.cjs');
const statusController = require('./src/controllers/statusController.cjs')


//Rota de status da aplicação
route.get('/clima/status', statusController.index);

//Rota de retorno do clima 
route.get('/clima', climaController.init);

module.exports = route;
