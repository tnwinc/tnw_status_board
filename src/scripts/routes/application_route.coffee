App.ApplicationRoute = Ember.Route.extend

  beforeModel: ->
    App.migrator.runMigrations()

  afterModel: ->
    @controllerFor('pusher').setupEvents (route, args...)=>
      Ember.run => @transitionTo "panes.#{route}", args...
