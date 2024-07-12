# [Wizzl](https://wizzl.co) App

A Node.js API wrapper to develop BOTs for Wizzl.

## How It Works

It's designed to be really easy for any developer to use.

### First, you need to install our codebase and set up a new client:

```shell
npm install wizzljs
```

Next, you need to import the Wizzl bot client class. This allows you to perform any actions without writing API requests.

```typescript
import { Client } from 'wizzljs'
```

Let's create our client.

```typescript
const client = new Client() // Optionally, you can set the protocol and domain as an object.
// The default configuration is: { protocol: 'https', domain: 'api.wizzl.co' } 
```

### There are some event methods for our bot.

#### The first method is `onReady()`, which is called when the bot successfully connects to our API and WebSocket. 
(It has no arguments)

```typescript
client.onReady(() => {
    // You might log something to the console.
    // This may be expanded in the future.
    console.log('Bot successfully connected')
})
```

#### The `onMessage()` method is called when someone sends a message to a channel where the bot is invited. Here, the only parameter is a message context. 
It's more than you might think, as everything you need to develop a bot is in that context.

Here's a small example of how it works:
```typescript
import { Ctx } from "wizzljs";

client.onMessage(async (ctx: Ctx) => {
    // If you have a prefix, you can check if the message starts
    // with a prefix by calling the ctx.message.withPrefix() method
    // with a prefix parameter. It will return a string without the prefix
    // or false if the message does not contain the prefix.
    const message = ctx.message.withPrefix('!')
    if(!message) return // Return when the message does not start with the prefix

    // Now make arguments from the message by splitting it.
    const args = message.split(' ')
    // Then you can get the main command from the message like this.
    const cmd = args.shift()
    if(!cmd) return

    // If the commands do not contain the cmd, just return.
    if(!['sayHi', 'react'].includes(cmd)) return
    
    switch (cmd) {
        case 'sayHi': {
            ctx.resource.send(`Hi ${ctx.message.sender.first_name}`)
            // ... or ctx.message.reply.text(`Hi ${ctx.message.sender.first_name}`)
            break
        }
        case 'react': {
            ctx.message.react('🚀')
            break
        }
    }
})
```

#### The `onReaction()` method is called when someone reacts to a message with an emoji.
(Unfortunately, we don't provide an API to check if you have already reacted to a message or not. You can solve this by using a database and storing all the message IDs that you have reacted to.)

```typescript
// In this demo we will use a simple JavaScript list, but it's stateless, so when the bot
// stops it can make mistakes.
const alreadyReactedTo: Array<number> = []

client.onReaction((ctx: ReactionCtx) => {
    console.log(`${ctx.reaction.sender.first_name} reacted to a message with ID: ${ctx.reaction.message_id}`)
    if(alreadyReactedTo.includes(ctx.reaction.message_id)) return
    alreadyReactedTo.push(ctx.reaction.message_id)
    ctx.reaction.react('😁')
})
```

### Connect our bot to Wizzl servers.

This step should be your last. Connect the bot with your token to our servers.

```typescript
console.log('Connecting...')
await client.connect('YOUR_TOKEN') // use .env files, never share the token with anyone
```