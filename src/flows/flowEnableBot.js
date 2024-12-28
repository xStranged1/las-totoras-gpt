import { addKeyword } from "@builderbot/bot";

export const flowEnableBot = addKeyword(['desactivar', 'activar'])
    .addAnswer('Ingrese nombre del cliente', { capture: true },
        async (ctx, { fallBack }) => {
            if (ctx.body.includes('f')) {
                return fallBack('opa')
            }
        },
    )
