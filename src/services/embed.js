const { CohereClient } = require('cohere-ai');
const { documents } = require('../../doc/documents')
const fs = require('fs');
const path = require('path');
const { multiply, transpose } = require('mathjs');
const { COHERE_API_KEY } = require('../../config/connections');


const cohere = new CohereClient({ token: COHERE_API_KEY });

const getEmbed = async () => {
    const response = await cohere.embed({
        model: "embed-multilingual-v3.0",
        texts: documents,
        inputType: "search_query",
        truncate: "NONE"
    });
    return response.embeddings
}


// Ruta del archivo JSON
const filePath = path.join(__dirname, 'embed.json');

// Función para leer o crear el archivo
const getOrCreateEmbed = async () => {
    if (fs.existsSync(filePath)) {
        // Leer y devolver el contenido del archivo si existe
        console.log('load embed.json');
        const contenido = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(contenido);
    }

    const embed = await getEmbed()
    // Crear el archivo con el contenido por defecto
    fs.writeFileSync(filePath, JSON.stringify(embed, null, 2));
    return embed;
}


function returnResults(queryEmb, docEmb, documents) {
    const n = 5; // Personaliza el número de resultados top-N
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


const queryEmb = async (query) => {
    const response = await cohere.embed({
        model: "embed-multilingual-v3.0",
        texts: [query],
        inputType: "search_query",
        truncate: "NONE"
    });
    const docEmbed = await getOrCreateEmbed()
    const results = await returnResults(response.embeddings, docEmbed, documents)
    return results
}

module.exports = { getOrCreateEmbed, queryEmb }