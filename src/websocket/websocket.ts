import WebSocket from 'ws'
import {Ctx, NewCtx} from "../ctx/ctx.js";
import {MessageEventType} from "../ctx/types/enums.js";
import {RawMessageData, RawMessageLike, RawMessageWrap} from "../ctx/types/types.js";
import {ReactionHandler} from "../client/base.js";
import {NewReactionCtx} from "../ctx/reaction_ctx.js";

export class WS {
    private readonly host: string
    private ws: WebSocket | null = null

    constructor(host: string) {
        this.host = host
    }

    public connect(onOpen: () => void, onMessage: (ctx: Ctx) => void, onReaction: ReactionHandler, onError: (err: Error) => void) {
        const ws = new WebSocket(this.host)
        ws.on('error', (err: Error) => {
            console.error('[ws] unknown error:', err)
            onError(err)
        })
        ws.on('open', () => {
            onOpen()
            this.ping(ws)
        })
        ws.on('message', (m) => {
            const data = m.toString()
            try {
                this.handleMessage(data, onMessage, onReaction)
            } catch(e: unknown) {
                console.error('Failed to handle message:', e)
            }
        })
        this.ws = ws
    }

    private ping(ws: WebSocket) {
        ws.send(JSON.stringify({
            resource: 'ws.default',
            message: {
                type: 'ping',
                content: 'ping',
                data_json: '{}',
                hook_id: '#'
            }
        }))
        setTimeout(() => this.ping(ws), 2500)
    }

    private handleMessage(raw: string, onMessage: (ctx: Ctx) => void, onReaction: ReactionHandler) {
        const data = JSON.parse(raw) as { message: {event: MessageEventType, data: unknown}, resource: string }
        if(data.resource == 'ws.default') return
        switch (data.message.event) {
            case MessageEventType.Message:
                onMessage(NewCtx(this, data as RawMessageWrap<RawMessageData>))
                break
            case MessageEventType.MessageLike:
                onReaction(NewReactionCtx(this, data as RawMessageWrap<RawMessageLike>))
                break
        }
    }

    public rawSend<T>(id: string, type: string, content: string, dataJSON: T | null = null) {
        const data_json = dataJSON != null ? JSON.stringify(dataJSON) : '{}'
        const hookID = '#'
        const payload = {
            resource: id,
            message: {
                type,
                content,
                data_json,
                hook_id: hookID
            }
        }
        if(!this.ws) return
        this.ws.send(JSON.stringify(payload), {}, (err => {
            if(err) console.error(`Failed to send message: ${err?.message}`)
            return
        }))
    }
}