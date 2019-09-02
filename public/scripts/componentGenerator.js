const ComponentGenerator = (() => {
  const ComponentBase = ({ html }) => ({
    appendTo: el => el.appendChild(html),
    appendChild: el => html.appendChild(el),
    appendChildren: els => els.forEach(el => html.appendChild(el))
  })

  const APP = document.createElement('div')
  APP.classList.add('container')
  document.body.appendChild(APP)

  return {
    App: {
      ...ComponentBase({ html: APP }),
      appendComponent: child => child.appendTo(APP),
      appendComponents: children => children.forEach(c => c.appendTo(APP))
    },
    Grid: ({
      flexDirection = 'row',
      justifyContent = 'space-evenly',
      alignItems = 'center',
    }) => {
      const section = document.createElement('div')

      $(section).css({
        display: 'flex',
        flexDirection: flexDirection,
        justifyContent: justifyContent,
        alignItems: alignItems,
      })
      return ({
        ...ComponentBase({ html: section }),
        addComponents: components => {
          components.forEach(c => c.appendTo(section))
        },
      })
    },
    Video: () => {
      const section = document.createElement('div')
      $(section).css({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      })
      const video = document.createElement('video')
      section.appendChild(video)
      return ({
        ...ComponentBase({ html: section }),
        takeSnapshot: dimensions => {
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          const height = dimensions && dimensions.height ? dimensions.height : 100
          const width = dimensions && dimensions.width ? dimensions.width : 100
          canvas.height = height
          canvas.width = width
          context.drawImage(video, 0, 0, width, height)
          return canvas.toDataURL('image/png')
        },
        streamFromWebcam: () => {
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
              .then(stream => {
                video.srcObject = stream;
                video.play()
              })
          } else {
            alert('Your device does not support accessing the video camera')
          }
        },
        stopStream: () => {
          video.stop()
        }
      })
    },
    SocketOutput: ({
      title = 'Socket Output',
    }) => {
      const section = document.createElement('div')
      const t = document.createElement('h1')
      t.innerText = title
      const base = document.createElement('div')
      base.classList.add(title)
      section.appendChild(t)
      section.appendChild(base)
      const indentSize = 10
      return {
        ...ComponentBase({ html: section }),
        title,
        clearSocketInfo: () => {
          while (base.firstChild) base.removeChild(base.firstChild)
        },
        addSocketMessage: message => {
          const recursiveIndent = (message, title, depth, includeMessage = false) => {
            const b = document.createElement('div')
            b.style.paddingLeft = `${indentSize * depth}px`
            const t = document.createElement('p')
            t.innerText = includeMessage ? title + ': ' + message : title
            b.appendChild(t)
            if (includeMessage) return b
            for (let k in message) {
              if (typeof message[k] !== 'object' && message[k] !== null) {
                b.appendChild(recursiveIndent(message[k], k, depth + 1, true))
              } else if (typeof message[k] === 'object' && message[k] !== null) {
                b.appendChild(recursiveIndent(message[k], k, depth + 1))
              }
            }
            return b
          }
          base.appendChild(recursiveIndent(message, '', -1))
        },
      }
    },
    Button: ({
      label = 'Untitled Button',
      disabled = false,
      onClick = () => { },
    }) => {
      const section = document.createElement('div')
      const button = document.createElement('button')
      section.appendChild(button)
      button.classList.add('btn', 'btn-primary')
      button.innerText = label
      button.onclick = onClick
      button.disabled = disabled
      return {
        ...ComponentBase({ html: section }),
        unDisable: () => button.disabled = false,
        disable: () => button.disabled = true,
      }
    },
    PredictionOutput: () => {
      const section = document.createElement('div')
      $(section).css({
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexWrap: 'wrap',
      })
        
      return {
        ...ComponentBase({html: section}),
        generate: ({
          input = [],
          predictions = [],
          classifiers = a => a,
        }) => {
          if(input.length !== predictions.length) throw Error('Predictions and Inputs should have same number of elements')
          while(section.firstChild) section.removeChild(section.firstChild)
          for(let i = 0 ; i < input.length; i++) {
            const div = document.createElement('div')
            $(div).css({
              padding: '16px',
            })
            const img = new Image()
            img.src = input[i]
            $(img).css({ 
              display: 'block', 
              margin: 'auto' 
             })
            const label = document.createElement('h3')
            label.innerText = classifiers(predictions[i])
            label.style.textAlign = 'center'
            div.appendChild(img)
            div.appendChild(label)
            section.appendChild(div)
          }
        }
      }
    }
  }
})()