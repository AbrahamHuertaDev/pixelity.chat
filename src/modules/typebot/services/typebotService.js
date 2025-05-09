const axios = require('axios');
const config = require('../../../config');

class TypebotService {
  constructor() {
    this.baseUrl = config.typebot.apiUrl;
    this.typebotId = config.typebot.typebotId;
  }

  async handleChat(message, chatId) {
    try {
      // Si no hay chatId, iniciamos una nueva sesión
      if (!chatId || chatId === 'null' || chatId === 'undefined' || chatId.trim() === '') {
        console.log('Iniciando nueva sesión...');
        const newSessionResponse = await axios.post(`${this.baseUrl}/typebots/${this.typebotId}/startChat`, {
          message,
          chat_id: null
        });

        if (!newSessionResponse.data) {
          throw new Error('No se recibió respuesta al iniciar nueva sesión');
        }

        return {
          data: newSessionResponse.data,
          sessionId: newSessionResponse.data.sessionId
        };
      }

      // Si hay chatId, intentamos continuar la sesión existente
      try {
        const response = await axios.post(`${this.baseUrl}/sessions/${chatId}/continueChat`, {
          message
        });

        if (!response.data) {
          throw new Error('No se recibió respuesta de Typebot');
        }

        return {
          data: response.data,
          sessionId: chatId
        };
      } catch (continueError) {
        // Si la sesión no existe (404), iniciamos una nueva
        if (continueError.response?.status === 404) {
          console.log('Sesión no encontrada, iniciando nueva sesión...');
          const newSessionResponse = await axios.post(`${this.baseUrl}/typebots/${this.typebotId}/startChat`, {
            message,
            chat_id: null
          });

          if (!newSessionResponse.data) {
            throw new Error('No se recibió respuesta al iniciar nueva sesión');
          }

          return {
            data: newSessionResponse.data,
            sessionId: newSessionResponse.data.sessionId
          };
        }
        throw continueError;
      }
    } catch (error) {
      console.error('Error en handleChat:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al comunicarse con Typebot');
    }
  }
}

module.exports = { TypebotService }; 