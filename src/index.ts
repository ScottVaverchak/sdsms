import bodyParser from "body-parser"
import express from "express"
import messageRouter from "./routes/message"

// @TODO(sjv): Pull out into an env var
const PORT = 8080

const app = express()

app.use(bodyParser.json())

app.use('/message', messageRouter)
app.get('/hb', (req, res) => { 
    res.send('♥')
})

app.listen(PORT, () => { 
    console.log(`Started listening on: http://localhost:${PORT}`)
})
