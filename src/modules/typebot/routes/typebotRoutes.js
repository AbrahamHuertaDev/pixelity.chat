const express = require('express');
const router = express.Router();
const typebotController = require('../controllers/typebotController');

// Ruta única para manejar el chat
router.post('/chat', typebotController.handleChat);

module.exports = router; 