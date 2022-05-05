// @TODO(sjv): Using a very basic in memory DB for now

import { v4 } from 'uuid'

// @TODO(sjv): Types should be somewhere else
export type Message = { 
    id: string, 
    sender_id: string, 
    recv_id: string, 
    message: string, 
    creation: number // Unix time? JSON doesn't have support for Date (its a feature?)
}

export type User = { 
    id: string, 
    name: string
}

type internalDb = {
    messages: Message[],
    users: User[]
}

const __db = { messages: [], users: [] } as internalDb

// @NOTE(sjv): Interface to allow me more flexibility down the road
// Naming could be better, this is technically an abstraction above
// the DB layer - but its too late for great naming

// @NOTE(sjv): These methods should have comments describing what they are intaking... but time.
// @NOTE(sjv): This is a poor solution, of course, but I wanted to keep the datalayer very simple 
export interface IDatabase { 
    insertMessage: (sender_id: string, recv_id: string, message: string) => Result<void, string>
    getMessages: (user_id: string) => Result<Message[], string> 
    getMessagesFromUser: (user_id: string, from_id: string) => Result<Message[], string>
    getUser: (user_id: string) => Result<User, string>
}

const unixTimeStamp = () => new Date().getTime() / 1e3
const thirtyDaysAgo = () => unixTimeStamp() - (30 * 24 * 60 * 60)

export class Database implements IDatabase { 
    insertMessage(sender_id: string, recv_id: string, message: string): Result<void, string> { 
        __db.messages.push({ id: v4(), sender_id, recv_id, message, creation: unixTimeStamp()})
        console.table(__db.messages)
        return { ok: true }
    }   
    
    getMessages(user_id: string): Result<Message[], string> {
        // @NOTE(sjv): This should be completed on the DB rather than in the server
        // A good DB will do this faster than ts
        const thirtyDays = thirtyDaysAgo()
        const messages = __db.messages
            .filter(m => m.recv_id === user_id && m.creation > thirtyDays)
            .slice(0, 100)

        return { ok: true, val: messages }
    }

    getMessagesFromUser(user_id: string, from_id: string): Result<Message[], string> {
        const thirtyDays = thirtyDaysAgo()
        const messages = __db.messages
            .filter(m => (m.recv_id === user_id && m.sender_id === from_id) && m.creation > thirtyDays)
            .slice(0, 100)

        return { ok: true, val: messages }
    }

    getUser(user_id: string): Result<User, string> {
        const user = __db.users.find(u => u.id === user_id)

        if(user === undefined) { 
            return { ok: false, err: 'Invalid user'}
        }

        return { ok: true, val: user}
    }
}

// @MOVE(sjv): This shouldn't be here
// @HMM(sjv): It would be nice to state `E` extends another type? Maybe?
export type Result<T, E> = { 
    ok: boolean
    val?: T
    err?: E
}
