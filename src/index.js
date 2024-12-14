const { createBot, createProvider, createFlow, addKeyword, EVENTS, endFlow } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const PostgreSQLAdapter = require('@bot-whatsapp/database/postgres')
const { POSTGRES_DB_HOST, POSTGRES_DB_USER, POSTGRES_DB_NAME, POSTGRES_DB_PASSWORD, POSTGRES_DB_PORT } = require('../config/connections')
const { runGPT } = require('./services')
const { getOrCreateEmbed, queryEmb } = require('./services/embed')
const { flowOpenai, flowImages, flowNotaDeVoz, flowWelcome, flowAyuda, flows } = require('./flows')
const { keywords, keywordsHello } = require('./consts/keywords')
const { pushHistory } = require('./flows/flowOpenai')


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

const flowPrincipal = addKeyword([...keywordsHello, EVENTS.WELCOME])

    .addAction(async (ctx, { endFlow }) => {
        if (ctx.from != 5492213996386) {
            console.log(`Modo prueba: Solo mensajes de 5492213996386 ${ctx.from}: ${ctx.body}`);
            return endFlow()
        }
    })

    /* 
        quiero que la primera vez de la bienvenida, y si escribe cualquier otra cosa despues,
        que vaya al flujo de openai
    */

    .addAction(async (ctx, { state, gotoFlow }) => {
        const myState = await state.getMyState()
        const myHistory = myState?.history || [];

        if (myHistory.length == 0) {
            const msg = ctx.body
            await pushHistory(state, 'user', msg)
            return gotoFlow(flowWelcome)
        } else {
            const msg = ctx.body
            if (!keywords.includes(msg)) {
                return gotoFlow(flowOpenai)
            }
        }
    })

const main = async () => {
    const adapterDB = new PostgreSQLAdapter({ host: POSTGRES_DB_HOST, user: POSTGRES_DB_USER, database: POSTGRES_DB_NAME, password: POSTGRES_DB_PASSWORD, port: POSTGRES_DB_PORT })
    const adapterFlow = createFlow([flowPrincipal, ...flows])
    const adapterProvider = createProvider(BaileysProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    QRPortalWeb()
}

main()
