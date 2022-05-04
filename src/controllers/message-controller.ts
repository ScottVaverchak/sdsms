import { IDatabase, Result } from "../datalayer/database";

class MessageController {

    constructor(private db: IDatabase) {}

    /**
     * 
     * Sends a message
     * 
     * @param user_id Originating User
     * @param recv_id Destination User
     * @param message Message
     * @returns On success, Result.ok will be true
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

}

export default MessageController