App.ProjectRoute = Ember.Route.extend

  model: (params)->
    App.pivotal.getProject(params.project_id).then (project)->
      _.pick project, 'id', 'name'
