through = require 'through2'
path = require 'path'
emberPrecompile = require 'ember-precompile'
gutil = require 'gulp-util'

PLUGIN_NAME = 'gulp-ember-handlebars'

module.exports = ->
  through.obj (file, enc, callback)->
    if file.isStream()
      @emit 'error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported')
      return callback()

    try
      compiled = emberPrecompile file.path, {}
    catch err
      @emit 'error', new gutil.PluginError(PLUGIN_NAME, err)
      return callback()

    file.path = gutil.replaceExtension file.path, '.js'
    file.contents = new Buffer compiled

    @push file
    callback()
