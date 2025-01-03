import { createBot, createProvider, createFlow, addKeyword, EVENTS } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { pool } from '../config/connections.js'
import { keywords, keywordsEnable, keywordsHello } from './consts/keywords.js'
import { flowAdmin, flowAyuda, flowEnableBot, flowImages, flowNotaDeVoz, flowWelcome } from './flows/index.js'
import dotenv from 'dotenv'
import { flowOpenai, pushHistory } from './flows/flowOpenai.js'
import { ADMIN_NUMBERS, WHITE_LIST } from './consts/consts.js'

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


const flowExample = addKeyword(['example'])
    .addAnswer(
        '*Enter the number to check:*',
        { capture: true },
        async (ctx, { provider, flowDynamic }) => {
            const checkNumber = ctx.body
            try {
                const onWhats = await provider.vendor.onWhatsApp(checkNumber)
                if (onWhats[0]?.exists) {
                    await flowDynamic([`*Exists:* ${onWhats[0].exists}\n*JID:* ${onWhats[0].jid}`, `*Object:* ${JSON.stringify(onWhats, null, 6)}`])
                }
                else {
                    await flowDynamic(`The number *${checkNumber}* does not exists on Whatsapp.`)
                }
            } catch (error) {
                await flowDynamic(`*Error:* ${error}`);
            }
        }
    )

const flowPrincipal = addKeyword([...keywordsHello, EVENTS.WELCOME])
    .addAction(async (ctx, { endFlow, gotoFlow, flowDynamic, state }) => {

        const msg = ctx.body

        if (!WHITE_LIST.includes(ctx.from)) {
            console.log(`Modo de prueba: Solo mensajes en whitelist ${ctx.from}: ${ctx.body}`);
            return endFlow()
        }

        if (ADMIN_NUMBERS.includes(ctx.from)) {

            const myState = state.getMyState()
            const doSetNumber = myState?.doSetNumber || [];
            const firstTime = myState?.firstTime || [];
            if (firstTime.length == 0) {
                await state.update({ firstTime: [true] });
                await flowDynamic('Hola, este es el flow de admin')
                await flowDynamic('👉 Escribe *activar* o *desactivar* para desactivar el chatbot a un numero en específico')
                await flowDynamic('👉 Escribe *ayuda* para solicitar hablar con una persona')
                await flowDynamic('👉 Escribe *imagenes* para ver imagenes de los departamentos')
                return endFlow()
            }

            if (doSetNumber.length > 0) {
                await state.update({ doSetNumber: [] });
                return gotoFlow(flowEnableBot)
            }

            if (keywordsEnable.includes(msg.toLocaleLowerCase())) {
                await flowDynamic('Escribe el numero del cliente')
                await state.update({ doSetNumber: [true] });
                return endFlow()
            } else {
                await flowDynamic('no valido')
                return endFlow()
            }
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
    const adapterFlow = createFlow([flowPrincipal, flowExample, flowWelcome, flowImages, flowOpenai, flowNotaDeVoz, flowAdmin, flowEnableBot, flowAyuda])

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

    adapterProvider.on('message', ({ body, from }) => {
        console.log(`Message Payload:`, { body, from })
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
