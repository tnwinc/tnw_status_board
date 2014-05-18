App.PanesStandupRoute = Ember.Route.extend

  model: (params)->
    @set 'timeout', setTimeout =>
      @transitionTo 'panes'
    , params.duration * 60 * 1000

    url: 'http://labs.tnwinc.com/storyboard'

  deactivate: ->
    clearTimeout @get('timeout')
