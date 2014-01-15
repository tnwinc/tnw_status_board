App.ProjectsRoute = App.Route.extend

  model: ->
    App.pivotal.getProjects().then (projects)->
      _.map projects, (project)->
        _.pick project, 'id', 'name'
