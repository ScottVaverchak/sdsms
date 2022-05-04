import express from "express"

// @TODO(sjv): Pull out into an env var
const PORT = 8080

const app = express()

app.get('/hb', (req, res) => { 
    res.send('♥')
})

app.listen(PORT, () => { 
    console.log(`Started listening on: http://localhost:${PORT}`)
})
