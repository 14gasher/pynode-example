const socketConnection = (() => {
  const listeners = {
    train: [],
    predict: [],
  }
  const socket = io('http://localhost:3333')
  socket.on('train', data => {
    listeners.train.forEach(l => l(data))
  })
  socket.on('predict', data => {
    listeners.predict.forEach(l => l(data))
  })
  return ({
    trainWithData: data => socket.emit('start train', data),
    predictWithData: data => socket.emit('start predict', data),
    addListener: {
      train: todo => listeners.train.push(todo),
      predict: todo => listeners.predict.push(todo),
    },
  })
})()
