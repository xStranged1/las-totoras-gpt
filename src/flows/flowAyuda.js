const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { flowOpenai } = require("./flowOpenai");

const flowAyuda = addKeyword(['ayuda', 'help', EVENTS.WELCOME])
    .addAnswer("En unos minutos una persona se comunicará con usted")
    .addAnswer(
        [
            'Si quieres volver a hablar con el chatbot de Totoras 750, escribe "chat"',
        ],
        null,
        null,
        [flowOpenai]
    )
module.exports = { flowAyuda }