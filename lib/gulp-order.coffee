through = require 'through2'
_ = require 'underscore'

globIndex = (path, globRegexes)->
  matchingGlob = _.find globRegexes, (globRegex)->
    globRegex.test path
  globRegexes.indexOf matchingGlob

module.exports = (globs)->
  globRegexes = _.map globs, (glob)->
    glob = glob.replace(/\//g, '\\/')
            .replace(/\-/g, '\\-')
            .replace(/\./g, '\\.')
            .replace(/\*$/, '[-_.a-zA-Z0-9]*')
    new RegExp("#{glob}\\.js$")

  files = []

  collectFiles = (file, enc, callback)->
    files.push file
    callback()

  endStream = (end)->
    files.sort (a, b)->
      aIndex = globIndex a.path, globRegexes
      bIndex = globIndex b.path, globRegexes
      aIndex - bIndex

    _.each files, (file)=> @push file
    end()

  through.obj collectFiles, endStream
