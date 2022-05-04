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
})