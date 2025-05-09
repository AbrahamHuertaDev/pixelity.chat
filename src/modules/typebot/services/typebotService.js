const axios = require('axios');
const { TypebotResponseService } = require('./typebotResponseService');

class TypebotService {
  constructor() {
    this.baseUrl = 'https://bot.pixelitystudios.com/api/v1';
    this.typebotId = 'my-typebot-c1srca8';
    this.responseService = new TypebotResponseService();
  }

  async handleChat(message, chatId = null) {
    try {
      let url;
      let payload;
      let response;

      if (chatId && chatId !== 'null' && chatId !== 'undefined' && chatId.trim() !== '') {
        try {
          // Solo intentamos continuar si hay un chat_id válido
          url = `${this.baseUrl}/sessions/${chatId}/continueChat`;
          payload = { message };
          response = await axios.post(url, payload);
        } catch (continueError) {
          console.log('Error al continuar chat, iniciando nueva sesión:', continueError.message);
          
          // Si falla, iniciamos nueva sesión
          url = `${this.baseUrl}/typebots/${this.typebotId}/startChat`;
          payload = { message, chat_id: null };
          response = await axios.post(url, payload);
        }
      } else {
        // Si no hay chat_id o es inválido, iniciamos una nueva conversación
        url = `${this.baseUrl}/typebots/${this.typebotId}/startChat`;
        payload = { message, chat_id: null };
        response = await axios.post(url, payload);
      }

      // Procesar la respuesta usando el servicio de respuesta
      const parsedResponse = this.responseService.parseResponse({
        data: response.data,
        sessionId: response.data.sessionId || chatId
      });

      return parsedResponse;
    } catch (error) {
      console.error('Error en handleChat:', error);
      throw new Error(error.response?.data?.message || 'Error al procesar el chat');
    }
  }
}

module.exports = { TypebotService }; 