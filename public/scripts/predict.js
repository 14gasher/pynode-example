(() => {
  const section = ComponentGenerator.Grid({
    flexDirection: 'column',
  })

  const socketOutput = ComponentGenerator.SocketOutput({
    title: 'Predicting',
  })

  socketConnection.addListener.predict(data => {
    socketOutput.addSocketMessage(data)
    console.log(socketOutput)
  })

  const button = ComponentGenerator.Button({
    label: 'Predict',
    disabled: Data_URIs.isReady(),
    onClick: () => {
      socketOutput.clearSocketInfo()
      console.log(socketOutput)
      socketConnection.predictWithData(Data_URIs.data)
    }
  })

  section.addComponents([socketOutput, button])
  ComponentGenerator.App.appendComponent(section)
  Data_URIs.addReadyListener(() => button.unDisable())
})()