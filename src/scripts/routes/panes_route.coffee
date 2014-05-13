App.PanesRoute = Ember.Route.extend

  model: ->
    App.settings.getValue 'panes'
