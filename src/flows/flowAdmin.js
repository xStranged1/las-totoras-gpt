import { addKeyword } from "@builderbot/bot";
import { flowNotaDeVoz } from "./flowVoice.js";
import { flowImages } from "./flowImages.js";
import { flowEnableBot } from "./flowEnableBot.js";

export const flowAdmin = addKeyword(['admin'])

    .addAnswer(
        'Escribe el numero del cliente',
        { capture: true },
        async (ctx, { flowDynamic }) => {
            return await flowDynamic(ctx.body)
        },
        [flowEnableBot, flowNotaDeVoz, flowImages]
    )

