class TypebotResponseService {
  constructor() {
    this.responseTypes = {
      TEXT: 'text',
      CHOICE: 'choice input',
      IMAGE: 'image',
      VIDEO: 'video',
      AUDIO: 'audio',
      FILE: 'file'
    };
  }

  parseResponse(response) {
    try {
      const { data, sessionId } = response;
      
      // Si no hay datos, retornar error
      if (!data) {
        return {
          success: false,
          error: 'No se recibieron datos de Typebot'
        };
      }

      // Extraer mensajes
      const messages = this.extractMessages(data.messages || []);
      
      // Extraer botones si existen
      const buttons = this.extractButtons(data.input);

      // Extraer acciones del cliente
      const clientActions = this.extractClientActions(data.clientSideActions || []);

      // Extraer logs si existen
      const logs = data.logs || [];

      // Construir respuesta final
      return {
        success: true,
        sessionId,
        typebot: data.typebot ? {
          id: data.typebot.id,
          version: data.typebot.version,
          publishedAt: data.typebot.publishedAt
        } : null,
        messages,
        buttons,
        clientActions,
        logs,
        resultId: data.resultId
      };
    } catch (error) {
      console.error('Error al parsear respuesta de Typebot:', error);
      return {
        success: false,
        error: 'Error al procesar la respuesta de Typebot',
        details: error.message
      };
    }
  }

  extractMessages(messages) {
    return messages.map(message => {
      switch (message.type) {
        case this.responseTypes.TEXT:
          return this.parseTextMessage(message);
        case this.responseTypes.IMAGE:
          return this.parseImageMessage(message);
        case this.responseTypes.VIDEO:
          return this.parseVideoMessage(message);
        case this.responseTypes.AUDIO:
          return this.parseAudioMessage(message);
        case this.responseTypes.FILE:
          return this.parseFileMessage(message);
        default:
          return {
            type: 'unknown',
            content: message
          };
      }
    });
  }

  parseTextMessage(message) {
    const richText = message.content?.richText || [];
    const text = richText
      .map(block => {
        if (block.type === 'p') {
          return block.children
            .map(child => child.text)
            .join('');
        }
        return '';
      })
      .join('\n')
      .trim();

    return {
      type: 'text',
      content: text
    };
  }

  parseImageMessage(message) {
    return {
      type: 'image',
      content: {
        url: message.content?.url,
        alt: message.content?.alt || ''
      }
    };
  }

  parseVideoMessage(message) {
    return {
      type: 'video',
      content: {
        url: message.content?.url,
        type: message.content?.type || 'video/mp4'
      }
    };
  }

  parseAudioMessage(message) {
    return {
      type: 'audio',
      content: {
        url: message.content?.url,
        type: message.content?.type || 'audio/mpeg'
      }
    };
  }

  parseFileMessage(message) {
    return {
      type: 'file',
      content: {
        url: message.content?.url,
        name: message.content?.name || 'archivo',
        type: message.content?.type || 'application/octet-stream'
      }
    };
  }

  extractButtons(input) {
    if (!input || input.type !== this.responseTypes.CHOICE) {
      return [];
    }

    return (input.items || []).map(item => ({
      id: item.id,
      text: item.content,
      edgeId: item.outgoingEdgeId
    }));
  }

  extractClientActions(actions) {
    return actions.map(action => {
      switch (action.type) {
        case 'redirect':
          return {
            type: 'redirect',
            url: action.url
          };
        case 'script':
          return {
            type: 'script',
            script: action.script
          };
        default:
          return {
            type: 'unknown',
            action
          };
      }
    });
  }
}

module.exports = { TypebotResponseService }; 