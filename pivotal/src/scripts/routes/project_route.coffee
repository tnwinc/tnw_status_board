App.ProjectRoute = App.Route.extend

  model: (params)->
    App.pivotal.getProject params.project_id

  setupController: (controller, model)->
    @_super()
    controller.set 'model', model

    App.pivotal.getProjects().then (projects)->
      controller.set 'projects', _.map projects, (project)->
        Ember.Object.create
          id: project.id
          label: project.name

    App.pivotal.getIterations(model.id, 'current_backlog').then (iterations)->
      controller.set 'iterations', _.map iterations, (iteration)->
        Ember.Object.create iteration
