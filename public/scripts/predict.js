(() => {
  const section = ComponentGenerator.Grid({
    flexDirection: 'column',
  })

  const socketOutput = ComponentGenerator.SocketOutput({
    title: 'Predicting',
  })

  const predictionOutput = ComponentGenerator.PredictionOutput()

  socketConnection.addListener.predict(data => {
    socketOutput.addSocketMessage(data)
    if (data.hasOwnProperty('predictions')) {
      predictionOutput.generate({
        input: ImageData.getPredictData(),
        predictions: data.predictions,
        classifiers: a => {
          switch(a){
            case 0: return 'Open Eyes'
            case 1: return 'Closed Eyes'
            default: return 'Unknown Class'
          }
        }
      })
    }
  })

  const button = ComponentGenerator.Button({
    label: 'Predict',
    disabled: false,
    onClick: () => {
      socketOutput.clearSocketInfo()
      socketConnection.predictWithData(ImageData.getPredictData())
    }
  })

  section.addComponents([socketOutput, button, predictionOutput])
  ComponentGenerator.App.appendComponent(section)
})()