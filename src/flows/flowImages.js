const { addKeyword } = require("@bot-whatsapp/bot");

const flowImages = addKeyword(['imagenes', 'imágenes', 'img', 'fotos'])
    .addAnswer("Estos son nuestros departamentos ✨")
    .addAnswer('*Totoras 1*', {
        media: 'https://raw.githubusercontent.com/xStranged1/las-totoras-gpt/refs/heads/main/doc/images/totoras-1.jpg',
    })
    .addAnswer('*Totoras 2*', {
        media: 'https://raw.githubusercontent.com/xStranged1/las-totoras-gpt/refs/heads/main/doc/images/totoras-2.jpg',
    })
    .addAnswer('*Totoras 3*', {
        media: 'https://raw.githubusercontent.com/xStranged1/las-totoras-gpt/refs/heads/main/doc/images/totoras-3.jpg',
    })
module.exports = { flowImages }