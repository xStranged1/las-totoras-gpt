import { addKeyword } from "@builderbot/bot"
import { keywords } from "../consts/keywords.js"
import { flowOpenai, flowImages, flowAyuda, flowNotaDeVoz } from "./index.js"

export const flowWelcome = addKeyword(['welcome'])
    .addAnswer('🙌 Hola bienvenidos al *Totoras 750*')
    .addAnswer(
        [
            'Te comparto la siguiente información, puedes preguntarme cualquier cosa relacionada con los alojamientos',
            '👉 Escribe *imagenes* para ver imagenes de los departamentos',
            '👉 Escribe *ayuda* para solicitar hablar con una persona',
        ],
        { capture: true },
        async (ctx, { gotoFlow }) => { // esto no funciona, solo funciona de app.js
            console.log('nunca se ejecuta esto');

            if (!keywords.includes(ctx.body)) {
                return gotoFlow(flowOpenai)
            }
        },
        [flowOpenai, flowImages, flowAyuda, flowNotaDeVoz]
    )
