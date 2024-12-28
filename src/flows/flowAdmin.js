import { addKeyword } from "@builderbot/bot";

export const flowAdmin = addKeyword(['admin'])

    .addAction({ capture: true }, async (ctx, { endFlow, flowDynamic }) => {
        await flowDynamic('flowAdmin')
        await flowAdmin(ctx.body)
        return endFlow
    })

