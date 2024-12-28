const { flowImages } = require('./flowImages')
const { flowOpenai } = require('./flowOpenai')
const { flowAyuda } = require('./flowAyuda')
const { flowNotaDeVoz } = require('./flowVoice')
const { flowWelcome } = require('./flowWelcome')
const { flowAdmin } = require('./flowAdmin')
const { flowEnableBot } = require('./flowEnableBot')

const flows = [flowWelcome, flowAyuda, flowImages, flowOpenai, flowNotaDeVoz, flowAdmin, flowEnableBot]
module.exports = { flows, flowAyuda, flowImages, flowOpenai, flowNotaDeVoz, flowWelcome, flowAdmin, flowEnableBot }