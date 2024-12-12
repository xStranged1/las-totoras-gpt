const { flowImages } = require('./flowImages')
const { flowOpenai } = require('./flowOpenai')
const { flowAyuda } = require('./flowAyuda')
const { flowNotaDeVoz } = require('./flowVoice')
const { flowWelcome } = require('./flowWelcome')

const flows = [flowWelcome, flowAyuda, flowImages, flowOpenai, flowNotaDeVoz]
module.exports = { flows, flowAyuda, flowImages, flowOpenai, flowNotaDeVoz, flowWelcome }