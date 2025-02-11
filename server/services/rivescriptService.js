import { fileURLToPath } from 'url';
import { dirname } from 'path';
import RiveScript from "rivescript";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const bot = new RiveScript();

export const loadRiveScript = async () => {
  await bot.loadFile(path.join(__dirname, "../rivescript/mental_health.rive"));
  bot.sortReplies();
};

export const getRiveResponse = async (user, message) => {
  try {
    const reply = await bot.reply(user, message);
    return reply !== "ERR: No Reply Matched" ? reply : null;
  } catch (error) {
    logError("RiveScript Error:", error);
    return null;
  }
};