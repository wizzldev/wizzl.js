import request from "../rest/request.js";

/**
 * Checks if the bot token is valid or not
 * @returns {Promise<boolean>} The token is valid or not
 */
export const checkBotToken = async (): Promise<boolean> => {
    const res = await request.get(`/bot/auth`)
    return !res.data.$error;
}
