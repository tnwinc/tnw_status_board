scopes = [
  id: 'done'
  order: 0
  name: 'Done'
  conditions:
    offset: -10
,
  id: 'current_backlog'
  order: 1
  name: 'Backlog'
  selected: true
]

App.ProjectRoute = App.Route.extend

  model: (params)->
    App.pivotal.getProject params.project_id

  setupController: (controller, model)->
    @_super()
    localStorage.projectId = JSON.stringify model.id

    controller.set 'model', model
    controller.set 'scopes', _.map scopes, (scope)->
      Ember.Object.create scope

    App.pivotal.getProjects().then (projects)=>
      controller.set 'projects', _.map projects, (project)->
        Ember.Object.create project
      @transitionTo 'scopes'
