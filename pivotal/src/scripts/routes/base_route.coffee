App.Route = Ember.Route.extend

  beforeModel: (transition)->
    if not App.pivotal.isAuthenticated()
      @controllerFor('login').set 'attemptedTransition', transition
      @transitionTo 'login'
