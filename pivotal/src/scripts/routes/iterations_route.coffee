inProgressStoryTypes = ['started', 'finished', 'delivered', 'rejected']

App.IterationsRoute = App.Route.extend

  model: ->
    App.pivotal.getIterations @modelFor('project').id

  setupController: (controller, model)->
    controller.set 'model', model

    if model.get 'length'
      stories = model.get 'firstObject.stories'
      @checkInProgressStories stories
      @controllerFor('application').on 'settingsUpdated', =>
        @checkInProgressStories stories

    projectModel = @modelFor 'project'
    App.pivotal.listenForProjectUpdates projectModel
    App.pivotal.on 'projectUpdated', ->
      App.pivotal.getIterations(projectModel.id).then (iterations)->
        controller.set 'model', iterations

  checkInProgressStories: (stories)->
    storiesInProgress = _.filter stories, (story)->
      _.contains inProgressStoryTypes, story.current_state
    inProgressMax = App.settings.getValue 'inProgressMax', 5

    appController = @controllerFor 'application'
    if storiesInProgress.length > inProgressMax
      appController.send 'showBanner', "There are over #{inProgressMax} stories in progress", 'warning'
    else
      appController.send 'hideBanner'

  deactivate: ->
    appController = @controllerFor 'application'
    appController.send 'hideBanner'
    appController.off 'settingsUpdated'

    App.pivotal.off 'projectUpdated'
