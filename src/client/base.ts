import {WS} from "../websocket/websocket.js"
import {checkBotToken} from "../rest/checkBotToken.js"
import {Ctx} from "../ctx/ctx.js"
import {MessageEventType} from "../ctx/types/enums.js"
import {ReactionCtx} from "../ctx/reaction_ctx.js";

export type MessageHandler = (ctx: Ctx) => void
export type ReactionHandler = (reaction: ReactionCtx) => void

export default class Base {
    protected ws: WS | null = null
    private _onOpen = () => {}
    private _onMessage: MessageHandler = () => {}

    private _onReaction: ReactionHandler = () => {}
    private _onError = (err: Error) => {
        console.error('[ws] an unknown error occurred', err)
    }

    public onReady(handler: () => void) {
        this._onOpen = handler
    }


    public onMessage(handler: (ctx: Ctx) => void) {
        this._onMessage = handler
    }

    public onReaction(handler: ReactionHandler) {
        this._onReaction = handler
    }


    public onError(handler: (err: Error) => void) {
        this._onError = handler
    }

    public async connect(token: string) {
        token = 'Bot ' + token;
        (global as any).token = token
        const ok = await checkBotToken()
        if(!ok) throw new Error(`Invalid Authentication Token`)
        const ws = new WS(`${(global as any).server}/ws/?authorization=${encodeURIComponent(token)}`)
        await ws.connect(this._onOpen, this._onMessage, this._onReaction, this._onError)
        this.ws = ws
    }

    public send<T>(groupID: string|number, type: MessageEventType, content: string, data: T | null = null) {
        this.ws?.rawSend<T>(groupID.toString(), type, content, data)
    }
}