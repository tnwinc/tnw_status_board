Migrator = Ember.Object.extend

  init: ->
    @migrations = {}

  registerMigration: (version, migration)->
    @migrations[version] = migration

  runMigrations: ->
    new Ember.RSVP.Promise (resolve)=>
      version = App.settings.getValue 'appVersion', '0.0.0'
      return resolve() if version is App.VERSION

      versionAssistant = App.VersionAssistant.create versions: _.keys(@migrations)
      versions = versionAssistant.versionsSince version
      operations = (@migrations[version]() for version in versions)

      updateVersion = new Ember.RSVP.Promise (resolve)->
        App.settings.updateString 'appVersion', App.VERSION, '0.0.0'
        resolve()
      operations.push updateVersion

      Ember.RSVP.all(operations).then -> resolve()

App.migrator = Migrator.create()
