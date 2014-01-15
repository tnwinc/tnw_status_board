App.Route = Ember.Route.extend

  beforeModel: ->
    if not App.pivotal.isAuthenticated()
      @transitionTo 'login'
