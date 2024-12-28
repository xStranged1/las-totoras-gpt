import { addKeyword } from "@builderbot/bot";

export const flowEnableBotTwo = addKeyword(['numero'])
    .addAction(null, async (ctx, { flowDynamic, blacklist }) => {
        console.log('action de flowEnableBotTwo');

        let number = ctx.body
        number = number.replace(/[-+\s]/g, "");
        console.log(number);
        console.log(blacklist);

        const dataCheck = blacklist.checkIf(number)
        await flowDynamic(`Muted: ${dataCheck}`);
        blacklist.add(ctx.from)
        await flowDynamic(`Se a cambiado el estado a ${dataCheck}`);

    })

