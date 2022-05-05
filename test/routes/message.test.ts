import { MockedObject, mockObject } from "../helpers/mocks"
import { IDatabase } from "../../src/datalayer/database"
import MessageController from "../../src/controllers/message-controller"

describe('message router', () => { 
    describe('add message', () => { 
        let db: MockedObject<IDatabase>

        beforeEach(() => { 
            db = mockObject(['insertMessage', 'getUser'])
        })

        it('should add a message to the db', () => { 
           const user1id = 'validUser1'
           const user2id = 'validUser2'

            db.getUser
                .mockReturnValueOnce({ ok: true, val: { id: 'validUser1', name: 'user1'}})
                .mockReturnValueOnce({ ok: true, val: { id: 'validUser2', name: 'user2'}})

            
            const messageController = new MessageController(db)
            const res = messageController.sendMessage(user1id, user2id, 'This is a message')

            expect(res.ok).toBe(true)
            expect(res.err).toBe(undefined)
            expect(db.getUser).toBeCalledTimes(2)
            expect(db.insertMessage).toBeCalledWith(user1id, user2id, 'This is a message')
         
        })

        it('should return an error when a user cannot be located', () => { 
            const user1id = 'invalidUser1'
            const user2id = 'validUser2'
 
             db.getUser
                 .mockReturnValueOnce({ ok: false, err: 'Error message'})
                 .mockReturnValueOnce({ ok: true, val: { id: 'validUser2', name: 'user2'}})
 
             
             const messageController = new MessageController(db)
             const res = messageController.sendMessage(user1id, user2id, 'This is a message')
 
             expect(res.ok).toBe(false)
             expect(res.err).toBe('Error message')
             expect(db.getUser).toBeCalledTimes(1)
             expect(db.insertMessage).not.toBeCalled()
          
         })
    })

    describe('getMessages', () => {
        let db: MockedObject<IDatabase>

        beforeEach(() => { 
            db = mockObject(['getMessages','getUser'])
        })

        it('it should return messages for a valid user', () => {
            const user_id = 'userNumber1'

            db.getUser.mockReturnValue({ok: true, val: {id: user_id, name:'Fred'}})
            db.getMessages.mockReturnValue({ok: true, val: [
                { id: '1', sender_id: '12', recv_id: user_id, message: 'Hello, world', creation: 123},
                { id: '2', sender_id: '13', recv_id: user_id, message: 'Hello, world1', creation: 123}
            ]})

            const messageController = new MessageController(db)

            const result = messageController.getMessages(user_id)

            expect(result.ok).toBe(true)
            expect(result.err).toBe(undefined)
            expect(db.getUser).toBeCalledWith(user_id)
            expect(db.getMessages).toBeCalledWith(user_id)
        })

        it('it should return an error if the user cannot be located', () => {
            const user_id = 'userNumber1'

            db.getUser.mockReturnValue({ok: false, err: 'Unable to locate user'})

            const messageController = new MessageController(db)

            const result = messageController.getMessages(user_id)

            expect(result.ok).toBe(false)
            expect(result.err).toBe('Unable to locate user')
            expect(db.getUser).toBeCalledWith(user_id)
            expect(db.getMessages).not.toBeCalled()
        })
    })

    describe('getMessagesFromUser', () => {
        let db: MockedObject<IDatabase>

        beforeEach(() => { 
            db = mockObject(['getMessagesFromUser','getUser'])
        })

        it('it should return messages from a user for a valid user', () => {
            const user_id = 'userNumber1'
            const fromUser_id = 'userNumber2'

            db.getUser.mockReturnValueOnce({ok: true, val: {id: user_id, name:'Fred'}})
                      .mockReturnValueOnce({ok: true, val: {id: fromUser_id, name: 'Melanie'}})

            db.getMessagesFromUser.mockReturnValue({ok: true, val: [
                { id: '1', sender_id: '12', recv_id: user_id, message: 'Hello, world', creation: 123},
                { id: '2', sender_id: '12', recv_id: user_id, message: 'Hello, world1', creation: 123}
            ]})

            const messageController = new MessageController(db)

            const result = messageController.getMessagesFromUser(user_id, fromUser_id)

            expect(result.ok).toBe(true)
            expect(result.err).toBe(undefined)

            expect(db.getUser).toBeCalledWith(user_id)
            expect(db.getUser).toBeCalledWith(fromUser_id)
            expect(db.getMessagesFromUser).toBeCalledWith(user_id, fromUser_id)
        })

        it('it should return an error if the user cannot be located', () => {
            const user_id = 'userNumber1'
            const fromUser_id = 'userNumber2'

            db.getUser.mockReturnValue({ok: false, err: 'Unable to locate user'})

            const messageController = new MessageController(db)

            const result = messageController.getMessagesFromUser(user_id, fromUser_id)

            expect(result.ok).toBe(false)
            expect(result.err).toBe('Unable to locate user')
            expect(db.getUser).toBeCalledWith(user_id)
            expect(db.getUser).not.toBeCalledWith(fromUser_id)
            expect(db.getMessagesFromUser).not.toBeCalled()
        })
    })
})