const express = require('express')
const app = express()

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

app.listen(3333)