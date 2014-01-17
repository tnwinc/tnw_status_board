scopes = [
  label: 'Done'
  type: 'done'
,
  label: 'Backlog'
  type: 'current_backlog'
  selected: true
]

App.ProjectRoute = App.Route.extend

  model: (params)->
    App.pivotal.getProject params.project_id

  setupController: (controller, model)->
    @_super()
    localStorage.projectId = JSON.stringify model.id

    controller.set 'model', model
    controller.set 'scopes', _.map scopes, (scope)-> Ember.Object.create scope

    App.pivotal.getProjects().then (projects)=>
      controller.set 'projects', _.map projects, (project)->
        Ember.Object.create
          id: project.id
          label: project.name
      @transitionTo 'scopes'
