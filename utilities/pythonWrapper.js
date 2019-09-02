const { spawn } = require('child_process')

module.exports = ({
  path,
  arguments,
  onData = () => {},
  onError = () => {},
}) => new Promise((resolve, reject) => {
  const python = spawn('python', [path])
  python.stdout.on('data', (data) => {
    const d = data.toString()
    try {
      onData(JSON.parse(d))
    } catch(e) {
      onData(d)
    }
  })
  python.stderr.on('data', (data) => {
    const error = data.toString()
    console.error(error)
    onError(error)
  })
  python.stdout.on('end', () => {
    resolve()
  })
  python.stdin.write(JSON.stringify(arguments))
  python.stdin.end()
})
