import {GroupType, Message, MessageSender, RawMessageData, RawMessageSender, RawMessageWrap} from "./types/types.js"
import {group} from "../rest/group.js"
import {WS} from "../websocket/websocket.js"
import {openChat} from "../rest/openChat.js";
import {MessageEventType} from "./types/enums.js";

export interface Ctx {
    message: Message
    type(): Promise<GroupType | null>,
    resource: {
        id: string
        send: (message: string) => void
    }
}

export const NewCtx = (ws: WS, m: RawMessageWrap<RawMessageData>): Ctx => {
    const message = newMessageData(ws, m.message.data, m.resource)

    return {
        message: message,
        type: async () => null,
        resource: {
            id: m.resource,
            send: (message: string) => {
                ws.rawSend(m.resource, MessageEventType.Message, message)
            }
        }
    } as Ctx
}

export const newMessageData = (ws: WS, m: RawMessageData, resource: string): Message => {
    return {
        id: m.id,
        sender: newMessageSender(ws, m.sender),
        content: m.content,
        withPrefix(prefix: string, caseSensitive: boolean = false): string | false {
            let message = m.content
            if(!caseSensitive) message = message.toLowerCase()
            if(!message.startsWith(prefix)) return false
            return message.substring(prefix.length)
        },
        type: m.type,
        data: JSON.parse(m.data_json),
        timestamps: {created_at: new Date(m.created_at).getTime(), updated_at: new Date(m.updated_at).getTime()},
        replied: m.reply ? newMessageData(ws, m.reply, resource) : null,
        reply: {
          text: (text: string) => ws.rawSend(resource.toString(), MessageEventType.Message, text, {reply_id: m.id})
        },
        react: (emoji: string) => ws.rawSend(resource.toString(), MessageEventType.MessageLike, emoji, {message_id: m.id}),
        group: async () => { return await group(parseInt(resource)) }
    } as Message
}

export const newMessageSender = (ws: WS, sender: RawMessageSender): MessageSender => {
    return {
        id: sender.id,
        timestamps: { created_at: new Date(sender.created_at).getTime(), updated_at: new Date(sender.updated_at).getTime() },
        first_name: sender.first_name,
        last_name: sender.last_name,
        email: sender.email,
        image_url: sender.image_url,
        is_online: sender.is_online,
        is_bot: sender.is_bot,
        contact: async () => {
            const id = await openChat(sender.id)
            if(!id) return null
            return {
                id: id,
                send: (text: string) => ws.rawSend(id.toString(), MessageEventType.Message, text)
            }
        }
    } as MessageSender
}