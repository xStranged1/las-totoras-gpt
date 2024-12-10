const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { flowAyuda } = require("./flowAyuda");


const flowNotaDeVoz = addKeyword(EVENTS.VOICE_NOTE)
    .addAnswer('Todavía no tengo capacidad para responder audios 😞')
    .addAnswer(
        [
            'Si deseas hablar con una persona, escribe "ayuda"',
        ],
        null,
        null,
        [flowAyuda]
    )

module.exports = { flowNotaDeVoz }