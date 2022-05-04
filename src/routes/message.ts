import express from "express"

const messageRouter = express.Router()

// @TODO(sjv): It would be nice to share these types with the front end
type RequestSendMessge = { 
    user_id: number, 

}

messageRouter.post('/', (req, res) => { 
    // Might make sense to move these 
    const request = req.body
    res.send('TODO: post /message')
})

messageRouter.get('/:userId', (req, res) => { 
  res.send('TODO: get /message/:userId')  
})

messageRouter.get('/:userId/:otherId', (req, res) => { 
    res.send('TODO: get /message/:userId/:otherId')
})


export default messageRouter