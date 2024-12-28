import { addKeyword, EVENTS } from "@builderbot/bot"
import { flowOpenai } from "./flowOpenai.js"

export const flowAyuda = addKeyword(['ayuda', 'help', EVENTS.WELCOME])
    .addAnswer("En unos minutos una persona se comunicará con usted")
    .addAnswer(
        [
            'Si quieres volver a hablar con el chatbot de Totoras 750, escribe "chat"',
        ],
        null,
        null,
        [flowOpenai]
    )