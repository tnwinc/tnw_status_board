App = require '../../app'
CalloutRoute = require '../../shared/callout_route'
sounds = require '../../shared/sounds'

require './panes.text'

App.PanesTextRoute = CalloutRoute.extend

  init: ->
    @_super()
    @set 'startSound', sounds.ping
    @set 'modelProperties', ['text', 'sender']
