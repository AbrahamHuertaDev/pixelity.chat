const { TypebotService } = require('../services/typebotService');
const { TypebotResponseService } = require('../services/typebotResponseService');

class TypebotController {
  constructor() {
    this.typebotService = new TypebotService();
    this.responseService = new TypebotResponseService();
  }

  handleChat = async (req, res) => {
    try {
      const { message, chat_id, phoneNumber } = req.body;
      
      if (!message || !phoneNumber) {
        return res.status(400).json({
          success: false,
          error: 'Se requiere mensaje y número de teléfono'
        });
      }

      const response = await this.typebotService.handleChat(message, chat_id);
      const formattedResponse = this.responseService.parseResponse({
        ...response,
        phoneNumber
      });

      res.json(formattedResponse);
    } catch (error) {
      console.error('Error en handleChat:', error);
      res.status(500).json({
        success: false,
        error: 'Error al procesar el mensaje',
        details: error.message
      });
    }
  }
}

module.exports = { TypebotController }; 