const parser = require('../config-parser-api')

const path = require('path')

parser.selectFrontend(path.join(__dirname, './haproxy.cfg'), (err, res, body) => {
  if (err) {
    console.error(err)
  } else {
    console.log(body)
  }
})
