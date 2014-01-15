App.LoginController = Ember.Controller.extend

  reset: ->
    @set 'token', ''

  actions:

    submit: ->
      App.pivotal.setToken @get('token')
      @transitionToRoute 'projects'
