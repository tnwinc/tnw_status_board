gulp = require 'gulp'
gutil = require 'gulp-util'
plumber = require 'gulp-plumber'
concat = require 'gulp-concat'
coffee = require 'gulp-coffee'
sass = require 'gulp-sass'
handlebars = require './gulp/gulp-ember-handlebars'

coffeeFiles = [
  'data/settings'
  'data/pivotal'
  'data/version_assistant'
  'data/migrator'
  'data/migrations/*'
  'models/*'
  'controllers/*'
  'views/*'
  'components/*'
  'helpers/*'
  'routes/*'
  'router'
].map (fileName)-> "./src/scripts/#{fileName}.coffee"

gulp.task 'coffee', ->
  gulp.src('./src/scripts/app.coffee')
    .pipe(plumber())
    .pipe(coffee().on('error', gutil.log))
    .pipe(gulp.dest('./build/'))

  gulp.src(coffeeFiles)
    .pipe(plumber())
    .pipe(coffee().on('error', gutil.log))
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./build/'))

gulp.task 'handlebars', ->
  gulp.src('./src/scripts/templates/*.hbs')
    .pipe(plumber())
    .pipe(handlebars().on('error', gutil.log))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./build/'))

gulp.task 'sass', ->
  gulp.src(['./src/stylesheets/*.scss', '!**/_*.scss'])
    .pipe(sass())
    .pipe(gulp.dest('./build/'))

gulp.task 'default', ->
  gulp.watch ['./src/scripts/*.coffee', './src/scripts/**/*.coffee'], ->
    gulp.run 'coffee'

  gulp.watch './src/scripts/templates/*.hbs', ->
    gulp.run 'handlebars'

  gulp.watch './src/stylesheets/*.scss', ->
    gulp.run 'sass'
