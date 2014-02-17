handlebars = require 'handlebars'
through = require 'through2'
_ = require 'underscore'
glob = require 'glob'
gutil = require 'gulp-util'

PLUGIN_NAME = 'gulp-build-index'

makeScriptTags = (files)->
  (_.map files, (file)-> "<script src=\"#{file}\"></script>").join gutil.linefeed

makeStylesheetTags = (files)->
  (_.map files, (file)-> "<link rel=\"stylesheet\" href=\"#{file}\" />").join gutil.linefeed

build = (jsFiles, stylesheetFiles)->
  through.obj (file, enc, callback)->
    if file.isStream()
      @emit 'error', new gutil.PluginError(PLUGIN_NAME,  'Streaming not supported')
      return callback()

    try
      template = handlebars.compile file.contents.toString()
      compiled = template(
        scripts: new handlebars.SafeString(makeScriptTags jsFiles)
        stylesheets: new handlebars.SafeString(makeStylesheetTags stylesheetFiles)
      )
    catch err
      @emit 'error', new gutil.PluginError(PLUGIN_NAME, err)
      return callback()

    file.path = gutil.replaceExtension file.path, '.html'
    file.contents = new Buffer compiled

    @push file
    callback()

module.exports =

  dev: (scriptGlobs, stylesheetFiles)->
    scriptFiles = _.flatten _.map scriptGlobs, (scriptGlob)->
      glob.sync "src/scripts/#{scriptGlob}.+(js|coffee|hbs)"

    jsFiles = _.map scriptFiles, (scriptFile)->
      gutil.replaceExtension(scriptFile, '.js').replace 'src/', ''

    build jsFiles, stylesheetFiles

  prod: (jsFiles, stylesheetFiles)->
    build jsFiles, stylesheetFiles
