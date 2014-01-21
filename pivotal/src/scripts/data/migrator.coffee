Migrator = Ember.Object.extend

  init: ->
    @migrations = {}

  registerMigration: (version, migration)->
    @migrations[version] = migration

  runMigrations: ->
    new Ember.RSVP.Promise (resolve)=>
      lsVersion = localStorage.appVersion
      version = if lsVersion then JSON.parse lsVersion else '0.0.0'
      version = '0.0.0' unless _.isString version
      return resolve() if version is App.VERSION

      versionAssistant = App.VersionAssistant.create versions: _.keys(@migrations)
      versions = versionAssistant.versionsSince version
      operations = (@migrations[version]() for version in versions)
      operations.push ->
        localStorage.appVersion = App.VERSION
        Ember.RSVP.resolve()

      Ember.RSVP.all(operations).then -> resolve()

App.migrator = Migrator.create()
