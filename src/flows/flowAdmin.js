const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { flowImages } = require('./flowImages')
const { flowNotaDeVoz } = require('./flowVoice')

const flowEnableBot = addKeyword(['desactivar', 'activar'])
    .addAnswer('Escribe el numero del cliente')
    .addAction({ capture: true }, async (ctx, { flowDynamic, blacklist }) => {
        const number = ctx.body
        const dataCheck = blacklist.checkIf(number)
        await flowDynamic(`Muted: ${dataCheck}`);

        await flowDynamic(`Se a cambiado el estado a ${dataCheck}`);
        blacklist.add(ctx.from)

    })

const flowAdmin = addKeyword(['admin'])
    .addAnswer('Hola, este es el flow de admin')
    .addAnswer(
        [
            '👉 Escribe *activar* o *desactivar* para desactivar el chatbot a un numero en específico',
            '👉 Escribe *ayuda* para solicitar hablar con una persona',
            '👉 Escribe *imagenes* para ver imagenes de los departamentos',
        ],
        [flowEnableBot, flowNotaDeVoz, flowImages]
    )

module.exports = { flowAdmin }