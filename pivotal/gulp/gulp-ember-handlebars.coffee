es = require 'event-stream'
path = require 'path'
emberPrecompile = require 'ember-precompile'

module.exports = ->
  es.map (file, callback)->
    fileName = path.basename(file.path, path.extname(file.path))
    compiled = emberPrecompile file.path, {}
    file.path = path.join path.dirname(file.path), "#{fileName}.js"
    file.contents = new Buffer compiled
    callback null, file
