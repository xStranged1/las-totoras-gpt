import { addKeyword, EVENTS } from "@builderbot/bot";
import { flowAyuda } from "./flowAyuda.js";

export const flowNotaDeVoz = addKeyword(EVENTS.VOICE_NOTE)
    .addAnswer('Todavía no tengo capacidad para responder audios 😞')
    .addAnswer(
        [
            'Si deseas hablar con una persona, escribe "ayuda"',
        ],
        null,
        null,
        [flowAyuda]
    )