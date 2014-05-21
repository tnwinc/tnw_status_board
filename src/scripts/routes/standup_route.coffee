App.PanesStandupRoute = App.CalloutRoute.extend

  init: ->
    @_super()
    @set 'startSound', App.sounds.trumpet
    @set 'endSound', App.sounds.buzzer
    @set 'presetModel', url: App.settings.getValue 'standupUrl'
    @set 'durationTransform', (duration)-> duration * 60 * 1000
