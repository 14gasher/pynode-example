const path = require('path')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const pythonWrapper = require('./utilities/pythonWrapper')

app.get('/:num1/plus/:num2', (req, res) => {
  const num1 = Number(req.params.num1)
  const num2 = Number(req.params.num2)
  if (isNaN(num1) || isNaN(num2)) return res.json({ error: 'Invalid Input' })
  pythonWrapper({
    path: './python/first.py',
    arguments: [num1, num2],
  })
    .then(data => res.json(data))
    .catch(err => {
      console.error(err.error)
      res.json([])
    })
})

io.on('connection', socket => {
  socket.on('start train', trainingData => {
    socket.emit('train', { status: 'Training Started' })
    pythonWrapper({
      path: './python/train_forest.py',
      arguments: trainingData,
      onData: data => socket.emit('train', data),
      onError: error => socket.emit('train', { error }),
    })
      .then(() => socket.emit('train', { completed: true }))
  })

  socket.on('start predict', predictData => {
    pythonWrapper({
      path: './python/use_forest_model.py',
      arguments: predictData,
      onData: data => socket.emit('predict', data),
      onError: error => socket.emit('predict', { error }),
    })
      .then(() => socket.emit('predict', {completed: true}))
  })
})

app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')))

app.use(express.static('public'))

server.listen(3333) // NOTE: app.listen won't work with web sockets