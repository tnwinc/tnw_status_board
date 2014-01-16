scopeOrder = ['done', 'current_backlog', 'icebox']

App.ScopesController = Ember.ArrayController.extend

  needs: 'project'

  sortProperties: ['order']

  count: (->
    "scopes-count-#{@get('model.length')}"
  ).property 'model.length'

  actions:

    addScope: (scope)->
      projectId = @get('controllers.project').get 'id'
      type = scope.get 'type'
      if scope.get('conditions')

      else
        App.pivotal.getIterations(projectId, type).then (iterations)=>
          scope = Ember.Object.create
            id: type
            name: scope.get 'label'
            order: scopeOrder.indexOf type
            iterations: _.map iterations, (iteration)->
              iteration.expanded = true
              Ember.Object.create iteration
          @get('model').addObject scope

    removeScope: (scope)->
      scopes = @get 'model'
      scopeToRemove = _.find scopes, (thisScope)->
        thisScope.get('id') is scope.get('type')
      scopes.removeObject scopeToRemove

    toggleExpansion: (iteration)->
      iteration.toggleProperty 'expanded'
      return
