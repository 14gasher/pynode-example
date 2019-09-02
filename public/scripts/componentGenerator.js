const ComponentGenerator = (() => {
  const ComponentBase = ({ html }) => ({
    appendTo: el => el.appendChild(html),
    appendChild: el => html.appendChild(el),
  })

  const APP = document.createElement('div')
  APP.classList.add('container')
  document.body.appendChild(APP)

  return {
    App: { ...ComponentBase({ html: APP }),
      appendComponent: child => child.appendTo(APP),
      appendComponents: children => children.forEach(c => c.appendTo(APP))
    },
    Grid: ({
      flexDirection = 'row',
      justifyContent = 'space-evenly',
      alignItems = 'center',
    }) => {
      const section = document.createElement('div')
      section.style = {...section.style, 
        display: 'flex',
        flexDirection: flexDirection,
        justifyContent: justifyContent,
        alignItems: alignItems,
      }
      return ({...ComponentBase({html: section}),
        addComponents: components => {
          components.forEach(c => c.appendTo(section))
        },
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
      return {...ComponentBase({html: section}),
        title,
        clearSocketInfo: () => {
          while(base.firstChild) base.removeChild(base.firstChild)
        },
        addSocketMessage: message => {
          const recursiveIndent = (message, title, depth, includeMessage = false) => {
            const b = document.createElement('div')
            b.style.paddingLeft = `${indentSize * depth}px`
            const t = document.createElement('p')
            t.innerText = includeMessage ? title + ': ' + message : title
            b.appendChild(t)
            if(includeMessage) return b
            for(let k in message) {
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
      onClick = () => {},
    }) => {
      const button = document.createElement('button')
      button.classList.add('btn', 'btn-primary')
      button.innerText = label
      button.onclick = onClick
      button.disabled = disabled
      return {...ComponentBase({ html: button }),
        unDisable: () => button.disabled = false,
        disable: () => button.disabled = true,
      }
    },
  }
})()