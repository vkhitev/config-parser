const fs = require('fs')

const request = require('request')

const PORT = 2016

/**
 * Connects to local server, then
 * selects frontends with ssl key and all
 * domains with related asl's
 * @param  {string}   path     path to config file
 * @param  {Function} callback callback function
 * @return {any}               result of callback function
 */
function selectFrontend (path, callback) {
  fs.exists(path, (exists) => {
    if (!exists) {
      return callback(Error(`File ${path} does not exist`))
    } else {
      let req = request.post(`http://127.0.0.1:${PORT}`, (err, res, body) => {
        if (err) {
          return callback(err)
        } else {
          return callback(null, res, body)
        }
      })

      let form = req.form()
      form.append('file', fs.createReadStream(path))
    }
  })
}

exports.selectFrontend = selectFrontend
