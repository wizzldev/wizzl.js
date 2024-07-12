import {GroupType, RawMessageLike, RawMessageWrap, Reaction} from "./types/types.js";
import {WS} from "../websocket/websocket.js";
import {newMessageData, newMessageSender} from "./ctx.js";
import {MessageEventType} from "./types/enums.js";
import {getMessage} from "../rest/getMessage.js";

export interface ReactionCtx {
    reaction: Reaction
    type(): Promise<GroupType | null>
    resource: {
        id: string
        send: (message: string) => void
    }
}

export const NewReactionCtx = (ws: WS, rawReaction: RawMessageWrap<RawMessageLike>): ReactionCtx => {
    return {
        reaction: newReaction(ws, rawReaction.message.data, rawReaction.resource),
        type: async () => null,
        resource: {
            id: rawReaction.resource,
            send: (message: string) => ws.rawSend(rawReaction.resource.toString(), MessageEventType.Message, message)
        }
    } as ReactionCtx
}

const newReaction = (ws: WS, raw: RawMessageLike, resource: string): Reaction => {
    return {
        reaction_id: raw.id,
        sender: newMessageSender(ws, raw.sender),
        message_id: raw.message_id,
        emoji: raw.emoji,
        react: (emoji: string) => ws.rawSend(resource.toString(), MessageEventType.MessageLike, emoji, {message_id: raw.message_id}),
        message: async () => {
            const message = await getMessage(parseInt(resource), raw.message_id)
            if(!message) return null
            return newMessageData(ws, message, resource)
        }
    } as Reaction
}