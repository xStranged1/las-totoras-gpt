const { ChromaClient } = require('chromadb')
const { exec } = require('child_process');

const express = require('express');
const { documents } = require('./documents');

exec('chroma run', { stdio: 'ignore' }, (err, stdout, stderr) => {
    if (err) {
        console.error(`Error ejecutando chroma run: ${stderr}`);
    } else {
        console.log('chroma run ejecutado exitosamente');
    }
});

const createChromaClient = async () => {
    const client = new ChromaClient();
    // switch `createCollection` to `getOrCreateCollection` to avoid creating a new collection every time
    const collection = await client.getOrCreateCollection({
        name: "totoras",
        metadata: { "hnsw:space": "cosine" },
    });
    // switch `addRecords` to `upsertRecords` to avoid adding the same documents every time

    await collection.upsert({
        documents: documents,
        ids: documents.map((doc, i) => i.toString()),
    });
    return { client, collection }
}

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3420;

setTimeout(async () => { // 5s to wait chroma sv start

    app.get('/', (req, res) => {
        res.send('¡Hola, Mundo!');
    });



    const { client, collection } = await createChromaClient()

    app.post('/query', async (req, res) => {
        const { query, maxResults } = req.body
        if (!query) return res.status(400).json('query is required')
        if (maxResults) {
            if (!Number.isInteger(maxResults)) return res.status(400).json('maxResults must be integer')
        }
        const results = await collection.query({
            queryTexts: query, // Chroma will embed this for you
            nResults: maxResults ?? 2, // how many results to return
        });
        res.status(200).send({ embeddings: results })
    });

    app.listen(PORT, () => {
        console.log(`Servidor chroma corriendo en el d ${PORT}`);
    });

}, 5000);