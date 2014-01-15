App.IndexRoute = App.Route.extend

  redirect: ->
    @transitionTo 'projects'
