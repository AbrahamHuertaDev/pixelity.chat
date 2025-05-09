const express = require('express');
const router = express.Router();
const clickupRoutes = require('../modules/clickup/routes');
const typebotRoutes = require('../modules/typebot/routes/typebotRoutes');

// Rutas de ClickUp
router.use('/clickup', clickupRoutes);

// Rutas de Typebot
router.use('/typebot', typebotRoutes);

module.exports = router; 