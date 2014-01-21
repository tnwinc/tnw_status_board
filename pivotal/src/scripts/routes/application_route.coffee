App.ApplicationRoute = Ember.Route.extend

  beforeModel: ->
    App.migrator.runMigrations()
