/*
    Demo code for wizzl bots
    Please only use our client and do not
    use third party APIs. It's against our policy.
 */

// DotEnv is a great way to import sensitive information's like the bot token.
import 'dotenv/config'
// Now you need to import the Wizzl bot client class.
// With that you can make anything possible without writing an API request.
import {Client} from "../src/index.js"
import handleOnMessage from "./message.js"
import {ReactionCtx} from "../src/index.js";

// Now you need to create a new client simple by creating a new class.
const client = new Client()

// There are some event methods for our bot.
// The first method is onReady(), it basically called when the bot is successfully
// connected to our API and Websocket. (It has no arguments)
client.onReady(() => {
    // Maybe you can log something to the console.
    // In the future it may be expanded.
    console.log('Bot successfully connected')
})

// The onMessage() method is called when someone sends a message
// to a channel where the bot is invited.
// Here the only parameter is a message context. It's more than you think,
// everything is in that context that you need to develop a bot.
client.onMessage(handleOnMessage)

// The onReaction() method is called when someone reacts to a message
// with an emoji. (Unfortunately we don't provide an API to check that you already
// reacted to a message or not. You can solve this by using a database and storing all the
// message id-s that you have reacted to.)
// In this demo we will use a simple javascript list, but it's stateless, so when the bot
// stops it can make mistakes.
const alreadyReactedTo: Array<number> = []
client.onReaction((ctx: ReactionCtx) => {
    console.log(`${ctx.reaction.sender.first_name} reacted to a message with ID: ${ctx.reaction.message_id}`)
    if(alreadyReactedTo.includes(ctx.reaction.message_id)) return
    alreadyReactedTo.push(ctx.reaction.message_id)
    ctx.reaction.react('😁')
})

console.log('Connecting...')
// This step should be your last. Connect the bot with your token
// to our servers.
await client.connect(process.env.TOKEN as string)