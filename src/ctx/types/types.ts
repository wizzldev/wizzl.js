// raw

export type MessageData = RawMessageData | RawMessageLike | RawMessageDelete

export type GroupType = 'private_message' | 'group_message' | 'private_with_bot'

export type RawMessageWrap<D extends MessageData> = {
    message: {
        event: string
        data: D,
        hook_id: string
    }
    resource: string
}

export interface RawMessageSender {
    id: number
    created_at: string
    updated_at: string
    first_name: string
    last_name: string
    email: string
    image_url: string
    is_online: boolean
    is_bot: boolean
}

export interface RawMessageData {
    id: number
    sender: RawMessageSender
    content: string
    type: string
    data_json: string
    created_at: string
    updated_at: string
    reply: RawMessageData | null
}

export type RawMessageDelete = number

export interface Message {
    id: number
    sender: MessageSender
    content: string
    withPrefix(prefix: string, caseSensitive: boolean): string | false
    type: string
    data: object
    timestamps: Timestamps
    replied: Message | null
    reply: {
        text(text: string): void
    }
    react(emoji: string): void
    group(): Promise<Group | null>
}

export type RawMessageLike = {
    id: number
    sender: RawMessageSender
    message_id: number
    emoji: string
}

export interface Reaction {
    reaction_id: number
    sender: MessageSender
    message_id: number
    emoji: string
    react(emoji: string): void
    message(): Promise<Message | null>
}

export interface MessageSender {
    id: number
    timestamps: Timestamps
    first_name: string
    last_name: string
    email: string
    image_url: string
    is_online: boolean
    is_bot: boolean
    contact(): Promise<MessageSenderContact | null>
    roles(): Promise<Roles>
}

export interface MessageSenderContact {
    id: number
    send(message: string): void
}

export interface Timestamps {
    created_at: number
    updated_at: number
}

export interface RawGroup {
    id: number
    created_at: string
    updated_at: string
    image_url: string
    name: string
    roles: Array<string>
}

export interface RawGroup {
    id: number
    created_at: string
    updated_at: string
    name: string
    roles: Array<string>
}

export interface Group {
    id: number
    image_url: string
    name: string
    roles: Roles
    timestamps: Timestamps
    message: {
        send(message: string): void
    }
}

export interface Roles {
    value: Array<string>
    can(role: string): boolean
}