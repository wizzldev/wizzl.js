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

    /**
     * Executes the handler when the client is successfully connected to the server.
     * @param {function} handler A void function that's called when the client is ready.
     */
    public onReady(handler: () => void) {
        this._onOpen = handler
    }

    /**
     * Executes the handler when someone send a message to a group where the bot present
     * @param {MessageHandler} handler
     */
    public onMessage(handler: (ctx: Ctx) => void) {
        this._onMessage = handler
    }

    /**
     * Executes the handler when someone reacts to a message
     * @param {ReactionHandler} handler
     */
    public onReaction(handler: ReactionHandler) {
        this._onReaction = handler
    }

    /**
     * Executes the handler when something goes wrong with the websocket connection
     * @param handler
     */
    public onSocketError(handler: (err: Error) => void) {
        this._onError = handler
    }

    /**
     * Connects to our API and WS servers
     * @param {string} token The secret token for the bot
     */
    public async connect(token: string) {
        token = 'Bot ' + token;
        (global as any).token = token
        const ok = await checkBotToken()
        if(!ok) throw new Error(`Invalid Authentication Token`)
        const ws = new WS(`${(global as any).ws_server}?authorization=${encodeURIComponent(token)}`)
        await ws.connect(this._onOpen, this._onMessage, this._onReaction, this._onError)
        this.ws = ws
    }

    /**
     * Send a Websocket message to our server
     * @param {(string|number)} groupID The ID of the group you want to send message
     * @param {MessageEventType} type The type of the message you want to send
     * @param {string} content The message content
     * @param {(object|null)} data Any additional data you want to send with
     */
    public send<T>(groupID: string|number, type: MessageEventType, content: string, data: T | null = null) {
        this.ws?.rawSend<T>(groupID.toString(), type, content, data)
    }
}