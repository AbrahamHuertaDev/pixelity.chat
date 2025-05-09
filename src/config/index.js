require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  typebot: {
    apiUrl: process.env.TYPEBOT_API_URL || 'https://bot.pixelitystudios.com/api/v1',
    typebotId: process.env.TYPEBOT_ID || 'my-typebot-c1srca8'
  }
}; 