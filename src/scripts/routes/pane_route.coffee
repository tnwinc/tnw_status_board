App.PaneRoute = Ember.Route.extend

  model: (params)->
    panes = App.settings.getValue 'panes'
    _.find panes, id: params.id
