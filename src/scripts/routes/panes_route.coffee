App.PanesRoute = Ember.Route.extend

  model: ->
    App.Pane.deserialize App.settings.getValue('panes')
