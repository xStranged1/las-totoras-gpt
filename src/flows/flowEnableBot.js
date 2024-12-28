const { addKeyword } = require('@bot-whatsapp/bot')

const flowEnableBot = addKeyword(['desactivar', 'activar'])
    .addAnswer('Escribe el numero del cliente')
    .addAction({ capture: true }, async (ctx, { flowDynamic, blacklist }) => {
        let number = ctx.body
        number = number.replace(/[-+\s]/g, "");
        console.log(number);
        console.log(blacklist);

        const dataCheck = blacklist.checkIf(number)
        await flowDynamic(`Muted: ${dataCheck}`);

        await flowDynamic(`Se a cambiado el estado a ${dataCheck}`);
        blacklist.add(ctx.from)

    })

module.exports = { flowEnableBot }