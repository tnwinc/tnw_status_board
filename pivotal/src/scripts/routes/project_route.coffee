App.ProjectRoute = App.Route.extend

  model: (params)->
    App.pivotal.getProject params.project_id

  setupController: (controller, model)->
    controller.set 'model', model

    localStorage.projectId = JSON.stringify model.id

    App.pivotal.getProjects().then (projects)=>
      controller.set 'projects', _.map projects, (project)->
        Ember.Object.create project
      @transitionTo 'iterations'
