const { OpenAI } = require('openai')
const { generatePrompt, generatePromptDetermine } = require("./prompt");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const runGPT = async (name, history) => {

    console.log("name recibido chatgpt");
    console.log(name);
    console.log("history recibido chatgpt");
    console.log(history);

    const promtp = generatePrompt(name)
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system",
                "content": promtp
            },
            ...history
        ],
        temperature: 1,
        max_tokens: 800,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    console.log("response chat GPT 3.5");
    console.log(response);

    return response.choices[0].message.content ?? ''
}

const runDetermine = async (history) => {
    try {
        const promtp = generatePromptDetermine()
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system",
                    "content": promtp
                },
                ...history
            ],
            temperature: 1,
            max_tokens: 800,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        if (!response.choices[0].message.content) return 'unknown'
        return response.choices.length > 0 && response.choices[0].message.role === 'assistant' ? response.choices[0].message.content : 'unknown'

    } catch (err) {
        console.log("err: ", err);
    }
}

module.exports = { runGPT, runDetermine }


