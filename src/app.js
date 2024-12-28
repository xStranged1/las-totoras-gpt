import { createBot, createProvider, createFlow, addKeyword, EVENTS } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { pool } from '../config/connections.js'
import { keywords, keywordsHello } from './consts/keywords.js'
import { flowAdmin, flowAyuda, flowEnableBot, flowEnableBotTwo, flowImages, flowNotaDeVoz, flowWelcome } from './flows/index.js'
import dotenv from 'dotenv'
import { flowOpenai, pushHistory } from './flows/flowOpenai.js'

dotenv.config()
const PORT = process.env.PORT ?? 3008


// import { queryEmb } from './services/embed.js'
// const doEmbed = async () => {
//     setTimeout(async () => {
//         const response = await queryEmb('me dan toallones, toallas y eso?', 5)
//         console.log("response3: ", response);
//     }, 2000);
// }
// doEmbed()

// const doQuery = async () => {
//     // const result = await pool.query('SELECT * FROM public.history LIMIT 5;');
//     const resultSelect = await pool.query('SELECT * FROM public.contact LIMIT 5;');

//     // const result = await pool.query(`ALTER TABLE contact
//     //     ADD COLUMN bot_active VARCHAR DEFAULT NULL,
//     //     ADD CONSTRAINT valid_bot_active CHECK (bot_active IN ('true', 'false', NULL));`);

//     // console.log(result);
//     console.log(resultSelect);

// }
// doQuery()

pool.on('error', (err) => {
    console.error('Unexpected error on idle client:', err);
});

const whiteList = ["5492246580576", "5492213996386", "5492246517055"]
const adminNumber = '5492246517055'


const flowPrincipal = addKeyword([...keywordsHello, EVENTS.WELCOME])
    .addAction(async (ctx, { endFlow, gotoFlow, flowDynamic }) => {

        if (!whiteList.includes(ctx.from)) {
            console.log(`Modo prueba: Solo mensajes en whitelist ${ctx.from}: ${ctx.body}`);
            return endFlow()
        }

        if (ctx.from == adminNumber) {
            await flowDynamic('Hola, este es el flow de admin')
            await flowDynamic('👉 Escribe *activar* o *desactivar* para desactivar el chatbot a un numero en específico')
            await flowDynamic('👉 Escribe *ayuda* para solicitar hablar con una persona')
            await flowDynamic('👉 Escribe *imagenes* para ver imagenes de los departamentos')
            return gotoFlow(flowAdmin)
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
    const adapterFlow = createFlow([flowPrincipal, flowWelcome, flowImages, flowOpenai, flowNotaDeVoz, flowAdmin, flowEnableBot, flowAyuda, flowEnableBotTwo])

    const adapterProvider = createProvider(Provider)
    const adapterDB = new Database({
        host: process.env.POSTGRES_DB_HOST,
        user: process.env.POSTGRES_DB_USER,
        database: process.env.POSTGRES_DB_NAME,
        password: process.env.POSTGRES_DB_PASSWORD,
        port: +process.env.POSTGRES_DB_PORT
    })

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

    httpServer(+PORT)
}

main()
