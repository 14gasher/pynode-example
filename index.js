const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const pythonWrapper = require('./utilities/pythonWrapper')

app.get('/:num1/plus/:num2', (req,res) => {
  const num1 = Number(req.params.num1)
  const num2 = Number(req.params.num2)
  if(isNaN(num1) || isNaN(num2)) return res.json({error: 'Invalid Input'})
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

app.post('/train', (req,res) => {
  trainingData = req.body
  console.log('begin training')
  pythonWrapper({
    path: './python/train_forest.py',
    arguments: trainingData,
  })
    .then(data => { console.log('Success', data); res.json(data)})
    .catch(err => {
      console.error(err.error)
      res.status(500).json({error: 'Check the server logs for more details'})
    })
})

app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')))

app.use(express.static('public'))

app.listen(3333)