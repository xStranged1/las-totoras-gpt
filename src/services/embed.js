import { CohereClient } from 'cohere-ai';
import { documents } from '../../doc/documents.js';
import fs from 'fs';
import path from 'path';
import { multiply, transpose } from 'mathjs';
import { COHERE_API_KEY } from '../../config/connections.js';
import { fileURLToPath } from 'url';
const cohere = new CohereClient({ token: COHERE_API_KEY });

const getEmbed = async () => {
    const response = await cohere.embed({
        model: "embed-multilingual-v3.0",
        texts: documents,
        inputType: "search_query",
        truncate: "NONE"
    });
    return response.embeddings;
};


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, 'embed.json');

const getOrCreateEmbed = async () => {
    if (fs.existsSync(filePath)) {
        console.log('load embed.json');
        const contenido = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(contenido);
    }

    const embed = await getEmbed();
    fs.writeFileSync(filePath, JSON.stringify(embed, null, 2));
    return embed;
};

function returnResults(queryEmb, docEmb, documents, nResults) {
    const n = nResults ?? 5;
    const scores = multiply(queryEmb, transpose(docEmb))[0];

    // Obtener los índices de los N puntajes más altos
    const maxIdx = scores
        .map((score, index) => ({ score, index }))
        .sort((a, b) => b.score - a.score)
        .slice(0, n)
        .map(item => item.index);

    const results = maxIdx.map((idx, rank) => ({
        rank: rank + 1,
        score: scores[idx],
        document: documents[idx],
    }));

    return results;
}

const queryEmb = async (query, nResults) => {
    const response = await cohere.embed({
        model: "embed-multilingual-v3.0",
        texts: [query],
        inputType: "search_query",
        truncate: "NONE"
    });
    const docEmbed = await getOrCreateEmbed();
    const results = await returnResults(response.embeddings, docEmbed, documents, nResults);
    return results;
};

export { getOrCreateEmbed, queryEmb };
