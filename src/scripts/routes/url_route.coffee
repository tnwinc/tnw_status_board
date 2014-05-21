App.PanesUrlRoute = App.CalloutRoute.extend

  init: ->
    @_super()
    @set 'startSound', App.sounds.ping
    @set 'modelProperties', ['url']
