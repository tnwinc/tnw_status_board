unacceptedStoryTypes = ['started', 'finished', 'delivered', 'rejected']

App.ScopesRoute = App.Route.extend

  deactivate: ->
    @controllerFor('application').send 'hideBanner'

  model: ->
    projectId = @modelFor('project').id
    App.pivotal.getIterations(projectId, 'current_backlog').then (iterations)->
      scope = Ember.Object.create
        id: 'current_backlog'
        name: 'Backlog'
        order: 0
        iterations: _.map iterations, (iteration)->
          Ember.Object.create iteration
      [scope]

  setupController: (controller, model)->
    controller.set 'model', model

    _.each model, (scope)=>
      _.each scope.get('iterations'), (iteration, index)=>
        if index is 0
          @checkStories iteration.get('stories')
        iteration.set 'expanded', true
        iteration.set 'hasStories', iteration.get('stories.length')

  checkStories: (stories)->
    unacceptedStories = _.filter stories, (story)->
      _.contains unacceptedStoryTypes, story.current_state
    applicationController = @controllerFor 'application'
    if unacceptedStories.length > 5
      applicationController.send 'showBanner', 'Your team has over 5 unaccepted stories in progress', 'warning'
    else
      applicationController.send 'hideBanner'
