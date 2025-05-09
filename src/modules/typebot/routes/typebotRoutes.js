const express = require('express');
const router = express.Router();
const { TypebotController } = require('../controllers/typebotController');

const typebotController = new TypebotController();

// Ruta única para manejar el chat
router.post('/chat', typebotController.handleChat);

module.exports = router; 