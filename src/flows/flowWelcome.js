const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { flowOpenai } = require('./flowOpenai')
const { flowImages } = require('./flowImages')
const { flowAyuda } = require('./flowAyuda')
const { flowNotaDeVoz } = require('./flowVoice')
const { keywords } = require('../consts/keywords')



const flowWelcome = addKeyword(['welcome'])
    .addAnswer('🙌 Hola bienvenidos al *Totoras 750*')
    .addAnswer(
        [
            'Te comparto la siguiente información, puedes preguntarme cualquier cosa relacionada con los alojamientos',
            '👉 Escribe *imagenes* para ver imagenes de los departamentos',
            '👉 Escribe *ayuda* para solicitar hablar con una persona',
        ],
        { capture: true },
        async (ctx, { gotoFlow }) => {

            if (!keywords.includes(ctx.body)) {
                return gotoFlow(flowOpenai)
            }
        },
        [flowOpenai, flowImages, flowAyuda, flowNotaDeVoz]
    )

module.exports = { flowWelcome }