App.ProjectsRoute = App.Route.extend

  model: ->
    App.pivotal.getProjects()
