const { addKeyword } = require("@bot-whatsapp/bot");

const flowAyuda = addKeyword(['imagenes', 'img', 'fotos'])
    .addAnswer("En unos minutos una persona se comunicará con usted")
    .addAnswer(
        [
            'Si quieres volver a hablar con el chatbot de Totoras 750, escribe "chat"',
        ],
        null,
        null,
        []
    )
module.exports = { flowAyuda }