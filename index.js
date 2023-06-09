const express = require('express')
const app = express()
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()

const PORT = process.env.PORT || 5000

app.ws('/', (ws, req) => {
  ws.send('You have successfully connected!')
  ws.on('message', (msg) => {
    msg = JSON.parse(msg)
    switch (msg.method) {
      case "connection": connectionHandler(ws, msg)
        break
      case "message": messagesHandler(ws, msg)
        break
    }
  })
})

app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`))

const connectionHandler = (ws, msg) => {
  ws.id = msg.id
  broadcastConnection(ws, msg)
}

const broadcastConnection = (ws, msg) => {
  aWss.clients.forEach(client => {
    if (client.id === msg.id) {
      client.send(`User ${msg.userName} connected!`)
    }
  })
}


const messagesHandler = (ws, msg) => {
  ws.id = msg.id
  broadcastMessage(ws, msg)
}

const broadcastMessage = (ws, msg) => {
  aWss.clients.forEach(client => {
    if (client.id === msg.id) {
      client.send(`${msg.userName}: ${msg.message}`)
    }
  })
}

