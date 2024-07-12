import {Group} from "../ctx/types/types.js";
import request from "../rest/request.js";

export const group = async (groupID: number): Promise<Group | null> => {
    const res = await request.get(`/chat/${groupID}`)
    if(res.data.$error || !res.data?.group) return null
    return res.data.group as Group
}