App = require '../../app'
CalloutRoute = require '../../shared/callout_route'
sounds = require '../../shared/sounds'

require './panes.standup'

App.PanesStandupRoute = CalloutRoute.extend

  init: ->
    @_super()
    @set 'startSound', sounds.trumpet
    @set 'endSound', sounds.buzzer
    @set 'presetModel', url: @store.fetch 'standupUrl'
    @set 'durationTransform', (duration)-> duration * 60 * 1000
