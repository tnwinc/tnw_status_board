App.PanesStandupRoute = Ember.Route.extend

  model: (params)->
    appController = @controllerFor 'application'
    appController.send 'playSound', 'http://soundfxnow.com/soundfx/MilitaryTrumpetTune1.mp3'

    @set 'timeout', setTimeout =>
      appController.send 'playSound', 'http://soundfxnow.com/soundfx/FamilyFeud-Buzzer3.mp3'
      @transitionTo 'panes'
    , params.duration * 60 * 1000

    url: App.settings.getValue 'standupUrl'

  deactivate: ->
    clearTimeout @get('timeout')
