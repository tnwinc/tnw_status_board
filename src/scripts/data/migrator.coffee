Migrator = Ember.Object.extend

  init: ->
    @migrations = {}

  registerMigration: (version, migration)->
    @migrations[version] = migration

  runMigrations: ->
    new Ember.RSVP.Promise (resolve)=>
      currentVersion = @currentVersion()
      return resolve() if currentVersion is App.VERSION

      versionAssistant = App.VersionAssistant.create versions: _.keys(@migrations)
      versions = versionAssistant.versionsSince currentVersion
      operations = (@migrations[version]() for version in versions)

      Ember.RSVP.all(operations).then ->
        App.settings.updateString 'appVersion', App.VERSION
        resolve()

  currentVersion: ->
    App.settings.getValue 'appVersion', '0.0.0'

App.migrator = Migrator.create()
