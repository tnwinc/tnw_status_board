App.ProjectsRoute = App.Route.extend

  model: ->
    App.pivotal.getProjects()

  redirect: ->
    projectId = localStorage.projectId
    if projectId
      @transitionTo 'project', JSON.parse(projectId)
