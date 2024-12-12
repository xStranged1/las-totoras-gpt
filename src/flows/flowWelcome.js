const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { flowOpenai } = require('./flowOpenai')
const { flowImages } = require('./flowImages')
const { flowAyuda } = require('./flowAyuda')
const { flowNotaDeVoz } = require('./flowVoice')
const { keywords } = require('../consts/keywords')



const flowWelcome = addKeyword(['welcome'])
    .addAnswer('🙌 Hola bienvenido al chatbot de *Totoras 750* ')
    .addAnswer(
        [
            'Te comparto la siguiente información, puedes preguntarme cualquier cosa relacionada con los departamentos de *Totoras 750*',
            '👉 *openai* para hablar con chat gpt',
            '👉 *imagenes* para ver imagenes',
            '👉 *ayuda* para solicitar hablar con una persona',
        ],
        { capture: true },
        async (ctx, { gotoFlow, state }) => {

            if (!keywords.includes(ctx.body)) {
                const myState = await state.getMyState()
                const myHistory = myState?.history || [];
                const mensaje = ctx.body
                const newHistory = [...myHistory, mensaje]
                await state.update({ history: newHistory });
                return gotoFlow(flowOpenai)
            }
        },
        [flowOpenai, flowImages, flowAyuda, flowNotaDeVoz]
    )

module.exports = { flowWelcome }