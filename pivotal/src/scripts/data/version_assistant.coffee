App.VersionAssistant = Ember.Object.extend

  init: ()->
    @sortMigrations()

  sortMigrations: ->
    @get('versions').sort (a, b)=> @versionSorter a, b

  versionSorter: (a, b)->
    [aMajor, aMinor, aPatch] = @convertToVersionArray a
    [bMajor, bMinor, bPatch] = @convertToVersionArray b

    return aMajor - bMajor if aMajor isnt bMajor
    return aMinor - bMinor if aMinor isnt bMinor
    return aPatch - bPatch if aPatch isnt bPatch
    return 0

  convertToVersionArray: (version)->
    _.map version.split('.'), (numString)-> Number numString

  versionsSince: (version)->
    versions = _.clone @get('versions')
    index = _.indexOf versions, version
    if index < 0
      versions.push version
      versions.sort (a, b)=> @versionSorter a, b
      index = _.indexOf versions, version
    versions.slice(index + 1)
