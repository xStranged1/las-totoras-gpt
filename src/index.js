const { createBot, createProvider, createFlow, addKeyword, EVENTS, endFlow } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const PostgreSQLAdapter = require('@bot-whatsapp/database/postgres')
const { POSTGRES_DB_HOST, POSTGRES_DB_USER, POSTGRES_DB_NAME, POSTGRES_DB_PASSWORD, POSTGRES_DB_PORT, pool } = require('../config/connections')
const { runGPT } = require('./services')
const { getOrCreateEmbed, queryEmb } = require('./services/embed')
const { flowOpenai, flowImages, flowNotaDeVoz, flowWelcome, flowAyuda, flows } = require('./flows')
const { keywords, keywordsHello } = require('./consts/keywords')
const { pushHistory } = require('./flows/flowOpenai')
const { generateInitialPrompt } = require('./services/prompt')

const doEmbed = async () => {

    setTimeout(async () => {
        const response = await queryEmb('me dan toallones, toallas y eso?', 5)
        console.log("response3: ", response);
    }, 2000);
}
// doEmbed()

const doPrompt = async () => {
    const prompt = await generateInitialPrompt('fede', 'hay un depto para 4 personas?')
    console.log(prompt);
}
//doPrompt()

const doQuery = async () => {
    // const result = await pool.query('SELECT * FROM public.history LIMIT 5;');
    const resultSelect = await pool.query('SELECT * FROM public.contact LIMIT 5;');

    // const result = await pool.query(`ALTER TABLE contact
    //     ADD COLUMN bot_active VARCHAR DEFAULT NULL,
    //     ADD CONSTRAINT valid_bot_active CHECK (bot_active IN ('true', 'false', NULL));`);

    // console.log(result);
    console.log(resultSelect);

}
doQuery()

pool.on('error', (err) => {
    console.error('Unexpected error on idle client:', err);
});

const whiteList = ["5492246580576", "5492213996386"]
const flowPrincipal = addKeyword([...keywordsHello, EVENTS.WELCOME])

    .addAction(async (ctx, { endFlow }) => {

        if (!whiteList.includes(ctx.from)) {
            console.log(`Modo prueba: Solo mensajes de 5492213996386 ${ctx.from}: ${ctx.body}`);
            return endFlow()
        }

    })

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
