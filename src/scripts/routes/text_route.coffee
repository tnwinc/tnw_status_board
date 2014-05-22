App.PanesTextRoute = App.CalloutRoute.extend

  init: ->
    @_super()
    @set 'startSound', App.sounds.ping
    @set 'modelProperties', ['text', 'sender']
