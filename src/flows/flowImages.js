const { addKeyword } = require("@bot-whatsapp/bot");

const flowImages = addKeyword(['imagenes', 'img', 'fotos'])
    .addAnswer('Este mensaje envia una imagen', {
        media: 'https://xstranged1.github.io/xStranged1/assets/me-12c0e623.jpg', //'c:\ruta\imagen.png'
    })
module.exports = { flowImages }