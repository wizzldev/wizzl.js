import {commands, prefix} from "./cmd.js";
import {Ctx} from "../src/index.js";

export default async (ctx: Ctx) => {
    // If you have a prefix, you can check that the message starts
    // with a prefix or not by calling the ctx.message.withPrefix() method
    // with a prefix parameter. It will return a string without the prefix
    // or false if the message does not contain the prefix.
    const message = ctx.message.withPrefix(prefix, false)
    // Just return when the bot has nothing to do with the message.
    if(!message) return

    // Now make arguments from the message by splitting it.
    const args = message.split(' ')
    // Then you can get the main command from the message like this.
    const cmd = args.shift()
    if(!cmd) return

    // If the commands do not contain the cmd, just return.
    if(!Object.keys(commands).includes(cmd)) return

    // Check if the first argument is help.
    if(args.length > 0 && args[0] === 'help') {
        // Return the help message for the command.
        return ctx.resource.send(`Help: ${cmd}: ${commands[cmd]}`)
    }

    switch (cmd) {
        case 'help': {
            // Send a help message.
            ctx.resource.send(`Hi! This is my prefix: ${prefix}\n\nThese are my commands:\n${Object.keys(commands).map(k => `${prefix}${k}: ${commands[k]}`).join('\n')}`)
            break
        }
        case 'hi': {
            // Send hi to the user with a message reply.
            ctx.message.reply.text(`${random(['Hi', 'Hello', 'Hey'])} ${ctx.message.sender.first_name}!`)
            break
        }
        case 'react': {
            // React to a message with an emoji.
            ctx.message.react(random(['❤️', '😎', '😁']))
            break
        }
    }
}

const random = (arr: Array<string>): string => {
    return arr[Math.floor(Math.random() * arr.length)]
}