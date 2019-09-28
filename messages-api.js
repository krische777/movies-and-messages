const express = require('express')
const bodyParser = require('body-parser')

const app = express()

port = 3000

app.listen(port, () => console.log(`My app is listening on port ${port}`))
app.use(bodyParser.json())

let requestCounter = 1

app.post('/messages', (request, response, ) => {
    if (!request.body.text || request.body.text == null) {
        response.status(400).end()
    }
    else {
        if (requestCounter <= 5) {
            console.log(request.body.text)
            response.json({"message": "Message received loud and clear"})
            requestCounter++

        } else {
            response.status(429).end()
        }
    }
}
)

