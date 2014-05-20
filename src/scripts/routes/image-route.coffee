App.PanesImageRoute = Ember.Route.extend

  model: (params)->
    @controllerFor('application').send 'playSound', App.sounds.ping

    @set 'timeout', setTimeout =>
      @transitionTo 'panes'
    , params.duration * 1000

    url: decodeURIComponent params.url

  deactivate: ->
    clearTimeout @get('timeout')
