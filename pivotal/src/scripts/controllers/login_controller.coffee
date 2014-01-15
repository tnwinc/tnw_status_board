App.LoginController = Ember.Controller.extend

  reset: ->
    @set 'token', ''

  actions:

    submit: ->
      App.pivotal.setToken @get('token')

      attemptedTransition = @get 'attemptedTransition'
      if attemptedTransition and attemptedTransition.targetName isnt 'login'
        attemptedTransition.retry()
        @set 'attemptedTransition', null
      else
        @transitionToRoute 'projects'
