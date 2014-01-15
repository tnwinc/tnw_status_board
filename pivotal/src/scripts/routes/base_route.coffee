App.Route = Ember.Route.extend

  activate: ->
    cssClass = @cssClass()
    if cssClass isnt 'application'
      Ember.$('body').addClass cssClass

  deactivate: ->
    Ember.$('body').removeClass @cssClass()

  cssClass: ->
    @routeName.replace(/\./g, '-').dasherize()

  beforeModel: (transition)->
    if not App.pivotal.isAuthenticated()
      @controllerFor('login').set 'attemptedTransition', transition
      @transitionTo 'login'
