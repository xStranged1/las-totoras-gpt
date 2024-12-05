const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')
const { ChromaClient } = require('chromadb')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const PostgreSQLAdapter = require('@bot-whatsapp/database/postgres')
const { POSTGRES_DB_HOST, POSTGRES_DB_USER, POSTGRES_DB_NAME, POSTGRES_DB_PASSWORD, POSTGRES_DB_PORT } = require('./config/dbConnection')
const { flowGracias } = require('./flows/flowGracias')
const { flowOpenai } = require('./flows/flowOpenai')
const { flowImages } = require('./flows/flowImages')
const { runGPT } = require('./services')
const { getOrCreateEmbed, queryEmb } = require('./services/embed')


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


/**
 * Aqui declaramos los flujos hijos, los flujos se declaran de atras para adelante, es decir que si tienes un flujo de este tipo:
 *
 *          Menu Principal
 *           - SubMenu 1
 *             - Submenu 1.1
 *           - Submenu 2
 *             - Submenu 2.1
 *
 * Primero declaras los submenus 1.1 y 2.1, luego el 1 y 2 y al final el principal.
 */

const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])

const flowDocs = addKeyword(['doc', 'documentacion', 'documentación']).addAnswer(
    [
        '📄 Aquí encontras las documentación recuerda que puedes mejorarla',
        'https://bot-whatsapp.netlify.app/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
    .addAnswer(
        [
            'te comparto los siguientes links de interes sobre el proyecto',
            '👉 *doc* para ver la documentación',
            '👉 *gracias*  para ver la lista de videos',
            '👉 *openai* para hablar con chat gpt',
            '👉 *imagenes* ver imagenes',
        ],
        null,
        null,
        [flowDocs, flowGracias, flowOpenai, flowImages]
    )
    .addAnswer((message) => {
        console.log('Recibido mensaje:', message);
        return 'Mensaje recibido y procesado.';
    });

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
