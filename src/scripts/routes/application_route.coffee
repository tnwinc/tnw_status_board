App.ApplicationRoute = Ember.Route.extend

  beforeModel: ->
    App.migrator.runMigrations()

  afterModel: ->
    App.Pusher.create().setupEvents (route, args...)=>
      Ember.run => @transitionTo "panes.#{route}", args...
