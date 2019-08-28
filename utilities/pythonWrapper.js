const { spawn } = require('child_process')

module.exports = ({
  path,
  arguments,
}) => new Promise((resolve, reject) => {
  const python = spawn('python', [path])
  let pythonResponse
  python.stdout.on('data', (data) => {
    pythonResponse = JSON.parse(data.toString())
  })
  python.stderr.on('data', (data) => {
    const error = data.toString()
    reject({error: 'Python Error:\n' + error})
  })
  python.stdout.on('end', () => {
    resolve(pythonResponse)
  })
  python.stdin.write(JSON.stringify(arguments))
  python.stdin.end()
})
