const { createBot, createProvider, createFlow, addKeyword, EVENTS, endFlow } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const PostgreSQLAdapter = require('@bot-whatsapp/database/postgres')
const { POSTGRES_DB_HOST, POSTGRES_DB_USER, POSTGRES_DB_NAME, POSTGRES_DB_PASSWORD, POSTGRES_DB_PORT } = require('../config/connections')
const { runGPT } = require('./services')
const { getOrCreateEmbed, queryEmb } = require('./services/embed')
const { flowOpenai, flowImages, flowAyuda, flowNotaDeVoz } = require('./flows')


const doGpt = async () => {
    const res = await runGPT('fede', [])

    console.log(res);
}


const doEmbed = async () => {
    const response = await queryEmb('que tienen los departamentos?')
    console.log("response1: ", response);

    setTimeout(async () => {
        const response = await queryEmb('como es el pago')
        console.log("response2: ", response);
    }, 1000);

    setTimeout(async () => {
        const response = await queryEmb('quiero alquilar 4 dias del 10 de diciembre al 14 de diciembre')
        console.log("response3: ", response);
    }, 2000);
}

const flowPrincipal = addKeyword(['hola', 'ole', 'alo', EVENTS.WELCOME])
    .addAction(async (ctx, { endFlow }) => {
        if (ctx.from != 5492213996386) {
            console.log(`Modo prueba: Solo mensajes de 5492213996386 ${ctx.from}: ${ctx.body}`);
            return endFlow()
        }
    })
    .addAction(async (ctx, { state }) => {
        const myState = await state.getMyState()
        const myHistory = myState?.history || [];
        await state.update({ history: [...myHistory, ctx.body] });
        console.log("myState");
        console.log(myState);
    })
    .addAnswer('🙌 Hola bienvenido al chatbot de *Totoras 750* ')
    .addAnswer(
        [
            'Te comparto la siguiente información, puedes preguntarme cualquier cosa relacionada con los departamentos de Totoras 750',
            '👉 *openai* para hablar con chat gpt',
            '👉 *imagenes* para ver imagenes',
            '👉 *ayuda* para solicitar hablar con una persona',
        ],
        null,
        null,
        [flowOpenai, flowImages, flowAyuda, flowNotaDeVoz]
    )

const main = async () => {
    const adapterDB = new PostgreSQLAdapter({ host: POSTGRES_DB_HOST, user: POSTGRES_DB_USER, database: POSTGRES_DB_NAME, password: POSTGRES_DB_PASSWORD, port: POSTGRES_DB_PORT })
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    QRPortalWeb()
}

main()
