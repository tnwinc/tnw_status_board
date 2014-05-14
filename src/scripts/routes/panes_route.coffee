App.PanesRoute = Ember.Route.extend

  model: ->
    panes = App.settings.getValue 'panes'
    _.map panes, (pane)->
      pane.properties = Ember.A _.map pane.properties, (property)->
        Ember.Object.create property
      Ember.Object.create pane
