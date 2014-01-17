inProgressStoryTypes = ['started', 'finished', 'delivered', 'rejected']

App.ScopesRoute = App.Route.extend

  deactivate: ->
    applicationController = @controllerFor 'application'
    applicationController.send 'hideBanner'
    applicationController.off 'settingsUpdated'

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
          stories = iteration.get 'stories'
          @checkInProgressStories stories
          @controllerFor('application').on 'settingsUpdated', =>
            @checkInProgressStories stories
        iteration.set 'expanded', true
        iteration.set 'hasStories', iteration.get('stories.length')

  checkInProgressStories: (stories)->
    storiesInProgress = _.filter stories, (story)->
      _.contains inProgressStoryTypes, story.current_state
    inProgressMax = JSON.parse localStorage.inProgressMax
    applicationController = @controllerFor 'application'
    if storiesInProgress.length > inProgressMax
      applicationController.send 'showBanner', "There are over #{inProgressMax} stories in progress", 'warning'
    else
      applicationController.send 'hideBanner'
