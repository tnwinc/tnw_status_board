App.Route = Ember.Route.extend

  redirectToLogin: (transition)->
      @controllerFor('login').set 'attemptedTransition', transition
      @transitionTo 'login'

  beforeModel: (transition)->
    if not App.pivotal.isAuthenticated()
      @redirectToLogin transition

  actions:

    error: (reason, transition)->
      @redirectToLogin transition
