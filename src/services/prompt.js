import { documents } from "../../doc/documents.js"
import { queryEmb } from "../services/embed.js"
const PROMPT_DETERMINE = `
Analiza la conversación entre el cliente (C) y el vendedor (V) para identificar el producto de interés del cliente.

PRODUCTOS DISPONIBLES:
- ID: CHATBOT: Curso sobre cómo crear un ChatBot de Whatsapp. Precio: 39 USD. Requisito: conocimiento en JavaScript.
- ID: AWS: Curso de AWS diseñado para programadores. Precio: 29 USD.
- ID: NODE: Curso sobre cómo crear una API Rest en Node con Express. Precio: 29 USD. Requisito: conocimiento en javascript.

Debes responder solo con el ID del producto. Si no puedes determinarlo o si el cliente muestra interés en más de un producto, debes responder 'unknown'.
ID: 
`

export const DATA_BASE = documents

export const TARIFAS = `El pago es con depósito del 50% el resto al ingresar. Precios: $175.000 por día para 5 personas. `

const PROMPT = `
Como asistente virtual para el alquiler de departamentos "Totoras 750" en Pinamar, tu principal responsabilidad es utilizar la información de la BASE_DE_DATOS para responder a las consultas de los clientes y persuadirlos para que alquilen un departamento.
------
BASE_DE_DATOS="{context}"
------
NOMBRE_DEL_CLIENTE="{customer_name}"

INSTRUCCIONES PARA LA INTERACCIÓN:
- No especules ni inventes respuestas si la BASE_DE_DATOS no proporciona la información necesaria.
- Si no tienes la respuesta o la BASE_DE_DATOS no proporciona suficientes detalles, pide que reformulé su pregunta.

DIRECTRICES PARA RESPONDER AL CLIENTE:
- Utiliza el NOMBRE_DEL_CLIENTE para personalizar tus respuestas y hacer la conversación más amigable
- No sugerirás ni promocionarás alquileres de otros competidores.
- El uso de emojis es permitido para darle más carácter a la comunicación, ideal para WhatsApp. Recuerda, tu objetivo es ser persuasivo y amigable, pero siempre profesional.
- Respuestas corta ideales para whatsapp menos de 300 caracteres.
`

export const generateInitialPrompt = async (name, message) => {
    const significantDB = await queryEmb(message, 5)
    const docs = significantDB.map((doc) => doc.document)
    return PROMPT.replace('{customer_name}', name).replace('{context}', docs)
}

export const generatePromptDetermine = () => {
    return PROMPT_DETERMINE
}