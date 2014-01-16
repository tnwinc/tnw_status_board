App.ProjectController = Ember.ObjectController.extend

  needs: 'scopes'

  actions:

    didSelectProject: (project)->
      @transitionToRoute 'project', project.get('id')

    didSelectScope: (scope)->
      scope.set 'selected', true
      @get('controllers.scopes').send 'addScope', scope

    didUnselectScope: (scope)->
      scope.set 'selected', false
      @get('controllers.scopes').send 'removeScope', scope
