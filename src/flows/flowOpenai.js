const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { runGPT } = require("../services/index");

const pushHistory = async (state, role, msg) => { // role: user | assistant | system
    const myState = await state.getMyState()
    const history = myState?.history || [];
    history.push({
        role: role,
        content: msg
    })
    await state.update({ history: history });
    return history
}

const flowOpenai = addKeyword(['openai', 'chatgpt', 'chat gpt'])

    .addAction(async (ctx, { flowDynamic, state }) => {
        try {
            const mensaje = ctx.body
            let newHistory = await pushHistory(state, 'user', mensaje)
            const name = ctx.pushName ?? ''
            const res = await runGPT(name, newHistory, mensaje)
            await flowDynamic(res)
            await pushHistory(state, 'assistant', res)
        } catch (err) {
            console.log("err");
            console.log(err);
        }
    })
module.exports = { flowOpenai, pushHistory }