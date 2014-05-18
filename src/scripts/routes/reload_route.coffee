App.PanesReloadRoute = Ember.Route.extend

  activate: ->
    @transitionTo 'panes'
    Ember.run.later -> location.reload true
