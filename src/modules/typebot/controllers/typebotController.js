const { TypebotService } = require('../services/typebotService');

class TypebotController {
  constructor() {
    this.typebotService = new TypebotService();
  }

  handleChat = async (req, res) => {
    try {
      const { message, chat_id } = req.body;
      const result = await this.typebotService.handleChat(message, chat_id);
      res.json(result);
    } catch (error) {
      console.error('Error en handleChat:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new TypebotController(); 