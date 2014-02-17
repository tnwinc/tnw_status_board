connect = require 'connect'

module.exports = (dir, port)->

  connect.createServer(
    connect.static "#{__dirname}/#{dir}"
  ).listen port

  console.log "serving assets on http://localhost:#{port}"
