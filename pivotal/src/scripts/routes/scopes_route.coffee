App.ScopesRoute = App.Route.extend

  model: ->
    projectId = @modelFor('project').id
    App.pivotal.getIterations(projectId, 'current_backlog').then (iterations)->
      scope = Ember.Object.create
        id: 'current_backlog'
        iterations: _.map iterations, (iteration)->
          Ember.Object.create iteration
      [scope]

  setupController: (controller, model)->
    controller.set 'model', model

    _.each model, (scope)->
      _.each scope.get('iterations'), (iteration)->
        iteration.set 'expanded', true
        iteration.set 'hasStories', iteration.get('stories.length')
