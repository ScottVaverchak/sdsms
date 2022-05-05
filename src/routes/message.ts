import express, { Response } from "express"
import MessageController from "../controllers/message-controller"
import { Database } from "../datalayer/database"

const messageRouter = express.Router()
const messageController = new MessageController(new Database())

// @NOTE(sjv): This should be expanded to offer more HTTP codes
const createErrorResponse = (res: Response, error: string) => res.status(400).send({ error })

messageRouter.post('/', (req, res) => { 
    console.log('POST: /message')
    // @NOTE(sjv): Ideally, I would like to make a type and be able to share it between frontend and backend
    const request = req.body

    if(request.user_id === undefined) { 
        return createErrorResponse(res, 'Invalid payload. Missing user_id')
    }

    if(request.recv_id === undefined) {
        return createErrorResponse(res, 'Invalid payload. Missing recv_id')
    }

    if(request.message === undefined || (request.message as string).trim().length === 0) { 
        return createErrorResponse(res, 'Invalid payload. Missing or empty message')
    }

    const { user_id, recv_id, message } = request

    // @NOTE(sjv): Spec doesn't say what a short message is - we will go with 42 chars
    if(message.length > 42) {
        return createErrorResponse(res, 'Message cannot exceed 42 characters')
    }
    const results = messageController.sendMessage(user_id as string, recv_id as string, message as string)

    if(results.ok === false) {
        // @NOTE(sjv): This should do deeper inspection and return a more refined HTTP status code
        return createErrorResponse(res, results.err ?? 'Internal error')
    }

    res.sendStatus(200)
})

messageRouter.get('/:userId', (req, res) => { 
    console.log('GET /message/:userId')  
    const userId = req.params.userId

    const result = messageController.getMessages(userId)

    if(result.ok === false) {
        createErrorResponse(res, result.err ?? 'Internal error')
    }

    // @HACK(sjv): The result type doesn't handle this (miss you, rust) - a better check is needed
    res.send({messages: result.val ?? []})
})

messageRouter.get('/:userId/:otherId', (req, res) => { 
    console.log('GET /message/:userId/:otherId')
    const userId = req.params.userId
    const otherId = req.params.otherId

    const result = messageController.getMessagesFromUser(userId, otherId)

    if(result.ok === false) {
        createErrorResponse(res, result.err ?? 'Internal error')
    }

    // @HACK(sjv): The result type doesn't handle this (miss you, rust) - a better check is needed
    res.send({messages: result.val ?? []})
})

export default messageRouter
