const { addKeyword } = require("@bot-whatsapp/bot");
const { runGPT } = require("../services/index");

const flowOpenai = addKeyword(['openai', 'chatgpt', 'chat gpt'])
    .addAnswer(['Hola, soy un chatbot de Totoras 450', '¿Como puedo ayudarte?'])
    .addAction(async (ctx, { flowDynamic, state }) => {
        try {
            console.log("ctx");
            console.log(ctx);
            const st = state.getMyState()
            console.log("st: ", st);
            const history = st.history
            console.log("history ", history);
            const res = await runGPT(ctx.pushName ?? '', history)
            await flowDynamic(res)

            let newHistory = history.push({
                role: 'assistant',
                content: res
            })

            await state.update({ history: newHistory })

        } catch (err) {
            console.log("err");
            console.log(err);
        }
    })
module.exports = { flowOpenai }