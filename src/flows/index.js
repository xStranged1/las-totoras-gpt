import { flowAdmin } from "./flowAdmin.js";
import { flowAyuda } from "./flowAyuda.js";
import { flowEnableBot } from "./flowEnableBot.js";
import { flowImages } from "./flowImages.js";
import { flowOpenai } from "./flowOpenai.js";
import { flowNotaDeVoz } from "./flowVoice.js";
import { flowWelcome } from "./flowWelcome.js";

export const flows = [flowWelcome, flowImages, flowOpenai, flowNotaDeVoz, flowAdmin, flowEnableBot, flowAyuda]

export { flowWelcome, flowImages, flowAyuda, flowOpenai, flowNotaDeVoz, flowAdmin, flowEnableBot }
