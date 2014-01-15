gulp = require 'gulp'
gutil = require 'gulp-util'
concat = require 'gulp-concat'
coffee = require 'gulp-coffee'
compass = require 'gulp-compass'
es = require 'event-stream'
path = require 'path'
Handlebars = require 'handlebars'

coffeeFiles = [
  'data/pivotal'
  'data/store'
  'models/*'
  'controllers/*'
  'views/*'
  'routes/*'
  'router'
].map (fileName)-> "./src/scripts/#{fileName}.coffee"

gulp.task 'coffee', ->
  gulp.src('./src/scripts/app.coffee')
    .pipe(coffee().on('error', gutil.log))
    .pipe(gulp.dest('./build/'))

  gulp.src(coffeeFiles)
    .pipe(coffee().on('error', gutil.log))
    .pipe(concat('application.js'))
    .pipe(gulp.dest('./build/'))

precompile = ->
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

gulp.task 'compileTemplates', ->
  gulp.src('./src/scripts/templates/*.hbs')
    .pipe(precompile())
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./build/'))

gulp.task 'compass', ->
  gulp.src(['./src/stylesheets/*.scss', '!**/_*.scss'])
    .pipe(compass(config_file: './config.rb', css: 'build', sass: 'src/stylesheets'))
    .pipe(gulp.dest('./tmp/'))

gulp.task 'default', ->
  gulp.watch ['./src/scripts/*.coffee', './src/scripts/**/*.coffee'], ->
    gulp.run 'coffee'

  gulp.watch './src/scripts/templates/*.hbs', ->
    gulp.run 'compileTemplates'

  gulp.watch './src/stylesheets/*.scss', ->
    gulp.run 'compass'
