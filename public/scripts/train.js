(() => {
  const data_uri = Data_URIs.data

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
    disabled: Data_URIs.isReady(),
    onClick: () => {
      socketOutput.clearSocketInfo()
      socketConnection.trainWithData({
        open: [
          data_uri[0],
          data_uri[0],
          data_uri[0],
          data_uri[0],
        ],
        closed: [
          data_uri[1],
          data_uri[1],
          data_uri[1],
          data_uri[1],
        ],
      })
    }
  })
  section.addComponents([socketOutput, button])
  ComponentGenerator.App.appendComponent(section)
  Data_URIs.addReadyListener(() => button.unDisable())
})()
