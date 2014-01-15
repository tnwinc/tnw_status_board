es = require 'event-stream'
path = require 'path'
Handlebars = require 'handlebars'

module.exports = ->
  es.map (file, callback)->
    try
      compiled = Handlebars.precompile file.contents.toString(), {}
    catch err
      return callback err, file

    fileName = path.basename(file.path, path.extname(file.path))
    templateName = fileName.replace(/\.(handlebars|hbs)$/, '').replace(/\./g, '/')
    compiled = 'Ember.TEMPLATES["' + templateName + '"] = Ember.Handlebars.template(' + compiled + ');'
    file.path = path.join path.dirname(file.path), "#{fileName}.js"
    file.contents = new Buffer compiled
    callback null, file
