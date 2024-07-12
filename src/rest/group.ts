import {Group} from "../ctx/types/types.js";
import request from "../rest/request.js";


/**
 * Gets a group from the API by its ID
 * @param {number} groupID
 * @returns {Promise<boolean>} The token is valid or not
 */
export const group = async (groupID: number): Promise<Group | null> => {
    const res = await request.get(`/chat/${groupID}`)
    if(res.data.$error || !res.data?.group) return null
    return res.data.group as Group
}