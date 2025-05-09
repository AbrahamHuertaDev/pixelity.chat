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
      const { data, sessionId, phoneNumber } = response;
      
      if (!data) {
        return {
          success: false,
          error: 'No se recibieron datos de Typebot'
        };
      }

      // Extraer mensajes y convertirlos al formato de WhatsApp
      const whatsappMessages = this.formatWhatsAppMessages(data.messages || [], data.input);

      return {
        success: true,
        sessionId,
        typebot: data.typebot ? {
          id: data.typebot.id,
          version: data.typebot.version,
          publishedAt: data.typebot.publishedAt
        } : null,
        whatsapp: whatsappMessages.map(message => ({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: phoneNumber,
          ...message
        })),
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

  formatWhatsAppMessages(messages, input) {
    const formattedMessages = [];
    let lastTextMessage = '';

    // Procesar mensajes de texto
    messages.forEach(message => {
      if (message.type === this.responseTypes.TEXT) {
        const text = this.parseTextMessage(message);
        if (text.content) {
          lastTextMessage = text.content;
          formattedMessages.push({
            type: "text",
            text: {
              preview_url: true,
              body: text.content
            }
          });
        }
      } else if (message.type === this.responseTypes.IMAGE) {
        formattedMessages.push({
          type: "image",
          image: {
            link: message.content?.url,
            caption: message.content?.alt || ''
          }
        });
      } else if (message.type === this.responseTypes.VIDEO) {
        formattedMessages.push({
          type: "video",
          video: {
            link: message.content?.url
          }
        });
      } else if (message.type === this.responseTypes.AUDIO) {
        formattedMessages.push({
          type: "audio",
          audio: {
            link: message.content?.url
          }
        });
      } else if (message.type === this.responseTypes.FILE) {
        formattedMessages.push({
          type: "document",
          document: {
            link: message.content?.url,
            filename: message.content?.name || 'archivo'
          }
        });
      }
    });

    // Procesar botones si existen
    if (input && input.type === this.responseTypes.CHOICE) {
      const buttons = this.extractButtons(input);
      if (buttons.length > 0) {
        // Si hay un mensaje de texto anterior, lo usamos como texto del botón
        const buttonText = lastTextMessage || "Por favor, selecciona una opción:";
        
        // Removemos el último mensaje de texto si existe
        if (lastTextMessage) {
          formattedMessages.pop();
        }

        // Si hay más de 3 botones, usamos lista
        if (buttons.length > 3) {
          formattedMessages.push({
            type: "interactive",
            interactive: {
              type: "list",
              header: {
                type: "text",
                text: "Opciones disponibles"
              },
              body: {
                text: buttonText
              },
              footer: {
                text: "Selecciona una opción de la lista"
              },
              action: {
                button: "Ver opciones",
                sections: [
                  {
                    title: "Opciones",
                    rows: buttons.map(button => ({
                      id: button.id,
                      title: button.text,
                      description: button.text
                    }))
                  }
                ]
              }
            }
          });
        } else {
          // Si hay 3 o menos botones, usamos botones normales
          formattedMessages.push({
            type: "interactive",
            interactive: {
              type: "button",
              body: {
                text: buttonText
              },
              action: {
                buttons: buttons.map(button => ({
                  type: "reply",
                  reply: {
                    id: button.id,
                    title: button.text
                  }
                }))
              }
            }
          });
        }
      }
    }

    return formattedMessages;
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
}

module.exports = { TypebotResponseService }; 