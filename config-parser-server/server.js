const http = require('http')

const parser = require('./parser')

const PORT = 2016

const server = http.createServer(onConnection)

server.listen(PORT)
server.on('listening', onListening)
server.on('error', onError)

function onConnection (req, res) {
  let body = []
  req.on('data', function (chunk) {
    body.push(chunk)
  }).on('end', function () {
    body = Buffer.concat(body).toString()
    const parsedConfig = parser.parseConfig(body)
    res.end(parsedConfig)
  })

  req.on('error', function (err) {
    res.end('Request error: ', err)
  })
}

function onListening () {
  var addr = server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  console.log('Listening on ' + bind)
}

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof PORT === 'string'
    ? 'Pipe ' + PORT
    : 'Port ' + PORT

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}
