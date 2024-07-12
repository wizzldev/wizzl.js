import request from "../rest/request.js";

export const openChat = async (userID: number): Promise<number|null> => {
    const res = await request.get(`${(global as any).server}/chat/private/${userID}`)
    console.log(userID, res.data)
    if(res.data.$error) return null
    if(res.data?.pm_id) return res.data.pm_id as number
    return null
}
