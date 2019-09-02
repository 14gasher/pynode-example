(() => {
  const section = ComponentGenerator.Grid({
    flexDirection: 'column',
  })

  const socketOutput = ComponentGenerator.SocketOutput({
    title: 'Training',
  })

  socketConnection.addListener.train(data => {
    socketOutput.addSocketMessage(data)
  })

  const button = ComponentGenerator.Button({
    label: 'Train',
    disabled: false,
    onClick: () => {
      socketOutput.clearSocketInfo()
      socketConnection.trainWithData(ImageData.getTrainingData())
    }
  })
  section.addComponents([socketOutput, button])
  ComponentGenerator.App.appendComponent(section)
})()
