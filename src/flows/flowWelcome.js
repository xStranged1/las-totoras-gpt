const { addKeyword, EVENTS, endFlow } = require('@bot-whatsapp/bot')
const { flowOpenai } = require('./flowOpenai')
const { flowImages } = require('./flowImages')
const { flowAyuda } = require('./flowAyuda')
const { flowNotaDeVoz } = require('./flowVoice')
const { keywords } = require('../consts/keywords')



const flowWelcome = addKeyword([EVENTS.WELCOME])
    .addAnswer('🙌 Hola bienvenido al chatbot de *Totoras 750* ')
    .addAnswer(
        [
            'Te comparto la siguiente información, puedes preguntarme cualquier cosa relacionada con los departamentos de *Totoras 750*',
            '👉 *openai* para hablar con chat gpt',
            '👉 *imagenes* para ver imagenes',
            '👉 *ayuda* para solicitar hablar con una persona',
        ],
        { capture: true },
        async (ctx, { gotoFlow }) => {
            console.log('estoy en openai');

            if (!keywords.includes(ctx.body)) {
                console.log('no incluye');

                return gotoFlow(flowOpenai)
            }
        },
        [flowOpenai, flowImages, flowAyuda, flowNotaDeVoz]
    )

module.exports = { flowWelcome }