// @TODO(sjv): Using a very basic in memory DB for now

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

// @NOTE(sjv): Interface to allow me more flexibility down the road
// Naming could be better, this is technically an abstraction above
// the DB layer - but its too late for great naming
export interface IDatabase { 

    insertMessage: (sender_id: string, recv_id: string, message: string) => Result<number, string>

    getAllMessages: (user_id: string) => Result<Message[], string> 

    getAllMessagesFromUser: (user_id: string, from_id: string) => Result<Message[], string>

    getUser: (user_id: string) => Result<User, string>
}

// @MOVE(sjv): This shouldn't be here
// @HMM(sjv): It would be nice to state `E` extends another type? Maybe?
export type Result<T, E> = { 
    ok: boolean
    val?: T
    err?: E
}
