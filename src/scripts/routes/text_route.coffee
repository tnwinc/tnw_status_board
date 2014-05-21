App.PanesTextRoute = Ember.Route.extend

  model: (params)->
    @controllerFor('application').send 'playSound', App.sounds.ping

    @set 'timeout', setTimeout =>
      @transitionTo 'panes'
    , params.duration * 1000

    text: decodeURIComponent params.text

  deactivate: ->
    clearTimeout @get('timeout')
