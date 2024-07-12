import request from "./request.js";
import {RawMessageData} from "../ctx/types/types.js";

/**
 * Gets the message by chat id and message id
 * @param {number} chatID
 * @param {number} messageID
 * @returns {Promise<RawMessageData|null>} The raw message data or null
 */
export const getMessage = async (chatID: number, messageID: number): Promise<RawMessageData | null> => {
    const res = await request.get(`/chat/${chatID}/message/${messageID}`)
    if(res.data.$error || !res.data) return null
    return res.data as RawMessageData
}
