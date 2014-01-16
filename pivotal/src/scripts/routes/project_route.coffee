App.ProjectRoute = App.Route.extend

  model: (params)->
    App.pivotal.getProject params.project_id

  setupController: (controller, model)->
    @_super()
    controller.set 'model', model

    scopes = [
      label: 'Done'
      type: 'done'
    ,
      label: 'Backlog'
      type: 'current_backlog'
      selected: true
    ,
      label: 'Icebox'
      type: 'icebox'
      conditions:
        with_state: 'unscheduled'
    ]

    controller.set 'scopes', _.map scopes, (scope)-> Ember.Object.create scope

    App.pivotal.getProjects().then (projects)=>
      controller.set 'projects', _.map projects, (project)->
        Ember.Object.create
          id: project.id
          label: project.name
      @transitionTo 'scopes'
