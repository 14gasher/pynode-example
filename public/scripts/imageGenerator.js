const AudioContext = window.AudioContext || window.webkitAudioContext
const audioContext = new AudioContext()

const ImageData = (() => {
  const trainingData = {
    open: [],
    closed: [],
  }

  const dimensions = {
    height: 500,
    width: 500,
  }

  const predictData = []

  const beep = playFrequency(300)

  const video = ComponentGenerator.Video()
  video.streamFromWebcam()

  const addToDataset = async ({
    instructions,
    storagePtr,
    count,
    ms = 300,
  }) => {
    alert(instructions)
    const takePictures = (remaining) => new Promise(resolve => {
      if (remaining <= 0) return resolve()
      console.log(remaining)
      setTimeout(() => {
        storagePtr.push(video.takeSnapshot(dimensions))
        return resolve(takePictures(remaining - 1))
      }, ms)
    })
    await takePictures(count)
    return beep.play()
  }

  const label1 = document.createElement('p')
  const label2 = document.createElement('p')

  label1.innerText = 'Training Data Count: 0'
  label2.innerText = 'Predict Data Count: 0'

  
  const button = ComponentGenerator.Button({
    label: 'Generate Labelled Data',
    onClick: () => {
      const generateTrainingData = async () => {
        await addToDataset({
          instructions: 'Close your eyes and move your face around slowly until you hear the beep.',
          storagePtr: trainingData.closed,
          count: 10,
          ms: 50,
        })
        await addToDataset({
          instructions: 'Keep your eyes open and move your face around slowly until you hear the beep.',
          storagePtr: trainingData.open,
          count: 10,
          ms: 50,
        })
        label1.innerText = 'Training Data Count: ' + (trainingData.open.length + trainingData.closed.length)
        return alert('Congrats! You now have new data to train on!')
      }

      generateTrainingData()
    }
  })

  button.appendChild(label1)

  const unlabeledBtn = ComponentGenerator.Button({
    label: 'Generate Unlabelled Data',
    onClick: () => addToDataset({
      instructions: 'Open and close your eyes to generate some unlabelled data',
      storagePtr: predictData,
      count: 30,
      ms: 100,
    })
      .then(() => label2.innerText = 'Predict Data Count: ' + predictData.length)
  })

  unlabeledBtn.appendChild(label2)

  const btnGrid = ComponentGenerator.Grid({
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
  })
  btnGrid.addComponents([button, unlabeledBtn])

  ComponentGenerator.App.appendComponents([video, btnGrid])

  function playFrequency(frequency) {
    // create 1 second worth of audio buffer, with single channels and sampling rate of your device.
    const sampleRate = audioContext.sampleRate;
    const duration = 0.1 * sampleRate;
    const numChannels = 1;
    const buffer = audioContext.createBuffer(numChannels, duration, sampleRate);
    // fill the channel with the desired frequency's data
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < sampleRate; i++) {
      channelData[i] = Math.sin(2 * Math.PI * frequency * i / (sampleRate));
    }


    return {
      play: () => {
        // create audio source node.
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        if (source.start) {
          source.start(0)
        } else if (source.play) {
          source.play(0)
        } else if (source.noteOn) {
          source.noteOn(0)
        }
      }
    }
    
  }

  return {
    getTrainingData: () => trainingData,
    getPredictData: () => predictData,
  }
})()