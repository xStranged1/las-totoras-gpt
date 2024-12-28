import { addKeyword, EVENTS } from "@builderbot/bot";
import { keywordsEnable } from "../consts/keywords.js";

export const flowEnableBot = addKeyword([keywordsEnable, EVENTS.WELCOME])

    .addAction(async (ctx, { flowDynamic, blacklist, state }) => {
        const number = ctx.body
        if (blacklist.checkIf(number)) {
            blacklist.remove(number)
            await flowDynamic(`El numero ${number} ahora esta desbloqueado`)
        } else {
            blacklist.add(number)
            await flowDynamic(`El numero ${number} ahora esta bloqueado`)
        }
        await state.update({ firstTime: [] });
    })
