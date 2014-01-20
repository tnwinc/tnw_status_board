inProgressStoryTypes = ['started', 'finished', 'delivered', 'rejected']

App.ProjectRoute = App.Route.extend

  model: (params)->
    App.pivotal.getProject params.project_id

  setupController: (controller, model)->
    controller.set 'model', model

    projectId = model.id
    localStorage.projectId = JSON.stringify projectId

    App.pivotal.getProjects().then (projects)=>
      controller.set 'projects', _.map projects, (project)->
        Ember.Object.create project

    App.pivotal.getIterations(projectId).then (iterations)=>
      controller.set 'iterations', _.map iterations, (iteration, index)=>
        iteration.expanded = true
        iteration.hasStories = iteration.stories.length > 0

        if index is 0 and iteration.hasStories
          @checkInProgressStories iteration.stories
          @controllerFor('application').on 'settingsUpdated', =>
            @checkInProgressStories iteration.stories

        Ember.Object.create iteration

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
