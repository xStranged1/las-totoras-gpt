const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { runGPT } = require("../services/index");

const flowOpenai = addKeyword(['openai', 'chatgpt', 'chat gpt'])

    .addAction(async (ctx, { flowDynamic, state }) => {
        const myState = await state.getMyState()
        const myHistory = myState?.history || [];

        const mensaje = ctx.body
        let newHistory = [...myHistory, mensaje]
        if (newHistory.lenght == 3) {
            newHistory = newHistory.slice(0, newHistory[newHistory.lenght - 1])
        }
        console.log('guarda historial en openai');

        await state.update({ history: newHistory });
        await flowDynamic(`historial mensajes:`)
        console.log("newHistory", newHistory);
        newHistory.forEach(async msg => {
            await flowDynamic(`Has dicho: ${msg}`)
        });
    })
// .addAction(async (ctx, { flowDynamic, state }) => {
//     console.log('segundo addaction');

//     try {
//         // console.log("ctx");
//         // console.log(ctx);
//         // const st = state.getMyState()
//         // console.log("st: ", st);
//         // const history = st.history
//         // console.log("history ", history);
//         // const res = await runGPT(ctx.pushName ?? '', history)
//         // await flowDynamic(res)

//         // let newHistory = history.push({
//         //     role: 'assistant',
//         //     content: res
//         // })
//         // await state.update({ history: newHistory })
//         pushName = ctx.pushName

//     } catch (err) {
//         console.log("err");
//         console.log(err);
//     }
// })
module.exports = { flowOpenai }