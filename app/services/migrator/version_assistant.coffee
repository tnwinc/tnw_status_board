Ember = require 'ember'

module.exports = Ember.Object.extend

  init: ->
    Ember.assert 'a `versions` property with an array of version must be passed to VersionAssistant.create', @get('versions')?
    @sortVersions()

  sortVersions: ->
    @get('versions').sort (a, b)=> @versionSorter a, b

  versionSorter: (a, b)->
    [aMajor, aMinor, aPatch] = @convertToVersionArray a
    [bMajor, bMinor, bPatch] = @convertToVersionArray b

    return aMajor - bMajor if aMajor isnt bMajor
    return aMinor - bMinor if aMinor isnt bMinor
    return aPatch - bPatch if aPatch isnt bPatch
    return 0

  convertToVersionArray: (version)->
    version.split('.').map (numString)-> Number numString

  versionsSince: (version)->
    versions = @get('versions').slice()
    index = versions.indexOf version
    if index < 0
      versions.push version
      versions.sort (a, b)=> @versionSorter a, b
      index = versions.indexOf version
    versions.slice(index + 1)
