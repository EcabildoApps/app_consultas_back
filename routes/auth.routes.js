const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth.controller');
const { deudas } = require('../controllers/deudas.controller');
const { consumo } = require("../controllers/consumo.controller");
const { tramites } = require("../controllers/tramites.controller");
const { pagos } = require("../controllers/pagos.controller");

router.post('/login', login);
router.post('/deudas', deudas);
router.post('/consumo', consumo);
router.post('/tramites', tramites);
router.post('/pagos', pagos);

// auth.routes.js o el archivo de rutas que estés usando
router.get('/testconnection', (req, res) => {
    res.status(200).json({ message: 'Conexión exitosa' });
});



module.exports = router;
