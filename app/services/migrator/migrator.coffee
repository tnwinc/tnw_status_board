Ember = require 'ember'
App = require '../../app'
VersionAssistant = require './version_assistant'
migrations = require './manifest'

module.exports = Ember.Object.extend

  runMigrations: ->
    new Ember.RSVP.Promise (resolve)=>
      currentVersion = @_currentVersion()
      return resolve() if currentVersion is App.VERSION

      versions = @_getVersionsSince currentVersion
      operations = (@_runMigration version for version in versions)

      Ember.RSVP.all(operations).then =>
        @get('store').save 'appVersion', App.VERSION
        resolve()

  _currentVersion: ->
    @get('store').fetch('appVersion') or '0.0.0'

  _getVersionsSince: (currentVersion)->
    versionAssistant = VersionAssistant.create versions: Object.keys(migrations)
    versionAssistant.versionsSince currentVersion

  _runMigration: (version)->
    console.log "running migration for version #{version}"
    migrations[version].create(store: @get('store')).run()
