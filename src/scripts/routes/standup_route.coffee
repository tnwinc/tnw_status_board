App.PanesStandupRoute = Ember.Route.extend

  model: (params)->
    appController = @controllerFor 'application'
    appController.send 'playSound', App.sounds.trumpet

    @set 'timeout', setTimeout =>
      appController.send 'playSound', App.sounds.buzzer
      @transitionTo 'panes'
    , params.duration * 60 * 1000

    url: App.settings.getValue 'standupUrl'

  deactivate: ->
    clearTimeout @get('timeout')
