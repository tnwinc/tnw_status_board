inProgressStoryTypes = ['started', 'finished', 'delivered', 'rejected']

App.ScopesController = Ember.ArrayController.extend

  needs: ['application', 'project']

  sortProperties: ['order']

  count: (->
    "scopes-count-#{@get('model.length')}"
  ).property 'model.length'

  checkInProgressStories: (stories)->
    storiesInProgress = _.filter stories, (story)->
      _.contains inProgressStoryTypes, story.current_state
    inProgressMax = App.settings.getValue 'inProgressMax', 5
    applicationController = @get 'controllers.application'
    if storiesInProgress.length > inProgressMax
      applicationController.send 'showBanner', "There are over #{inProgressMax} stories in progress", 'warning'
    else
      applicationController.send 'hideBanner'

  actions:

    addScope: (scope)->
      projectId = @get('controllers.project').get 'id'
      conditions = scope.get('conditions') || {}
      conditions.scope = scope.get 'id'

      App.pivotal.getIterations(projectId, conditions).then (iterations)=>
        scope = Ember.Object.create scope
        scope.set 'iterations', _.map iterations, (iteration, index)=>
          iteration.expanded = true
          iteration.hasStories = iteration.stories.length > 0

          if scope.get('id') is 'current_backlog' and index is 0 and iteration.hasStories
            @checkInProgressStories iteration.stories
            @get('controllers.application').on 'settingsUpdated', =>
              @checkInProgressStories iteration.stories

          Ember.Object.create iteration

        @get('model').addObject scope

    removeScope: (scope)->
      scopes = @get 'model'
      scopeToRemove = _.find scopes, (thisScope)->
        thisScope.get('id') is scope.get('id')
      scopes.removeObject scopeToRemove

    toggleExpansion: (iteration)->
      iteration.toggleProperty 'expanded'
      return
