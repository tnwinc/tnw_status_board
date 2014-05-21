App.CalloutRoute = Ember.Route.extend

  model: (params)->
    appController = @controllerFor 'application'

    if @get('startSound')
      appController.send 'playSound', @get('startSound')

    duration = if @get 'durationTransform'
      @get('durationTransform')(params.duration)
    else
      params.duration * 1000

    @set 'timeout', setTimeout =>
      if @get('endSound')
        appController.send 'playSound', @get('endSound')
      @transitionTo 'panes'
    , duration

    if @get 'presetModel'
      return @get 'presetModel'

    model = {}
    for property in @get('modelProperties')
      model[property] = decodeURIComponent params[property]

    model

  deactivate: ->
    clearTimeout @get('timeout')
