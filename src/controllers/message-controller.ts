import { IDatabase, Result, Message } from "../datalayer/database";

/**
 * Message Controller 
 * 
 * Handles sending and retrieving messages
 */
class MessageController {

    constructor(private db: IDatabase) {}

    /**
     * 
     * Sends a message
     * 
     * @param user_id Originating User
     * @param recv_id Destination User
     * @param message Message
     * @returns On success, Result.val will be true
     *          On error, Result.err will contain the error message
     */
    sendMessage(user_id: string, recv_id: string, message: string): Result<boolean, string> { 
        const destUser = this.db.getUser(user_id)
        if(destUser.ok === false) { 
            return { ok: false, err: destUser.err }
        }

        const recvUser = this.db.getUser(recv_id)
        if(recvUser.ok === false) { 
            return { ok: false, err: recvUser.err}
        }

        this.db.insertMessage(user_id, recv_id, message) 
        return { ok: true, val: true }
    }

    /**
     * 
     * Returns the messages for the user
     * 
     * @param user_id The user_id of the messages sent to the user
     * @returns On success, Result.val will contain the messages
     *          On error, Result.err will contain the error message 
     */
    getMessages(user_id: string): Result<Message[], string> {
        const userRes = this.db.getUser(user_id)

        if(userRes.ok === false) {
            return { ok: false, err: userRes.err }
        }

        // @NOTE(sjv): Depending on future errors, this may need to be updated
        return this.db.getMessages(user_id)
    }

    /**
     * Returns the messages for the user from a specific user
     *  
     * @param user_id The user_id of the messages sent to the user 
     * @param fromUser_id The source of the messages
     * @returns On success, Result.val will contain the messages
     *          On error, Result.err will contain the erro message
     */
    getMessagesFromUser(user_id: string, fromUser_id: string): Result<Message[], string> {
        const destUser = this.db.getUser(user_id)
        if(destUser.ok === false) { 
            return { ok: false, err: destUser.err }
        }

        const recvUser = this.db.getUser(fromUser_id)
        if(recvUser.ok === false) { 
            return { ok: false, err: recvUser.err}
        }

        // @NOTE(sjv): Depending on future errors, this may need to be updated
        return this.db.getMessagesFromUser(user_id, fromUser_id)
    }

}

export default MessageController