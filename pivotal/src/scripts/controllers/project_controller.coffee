App.ProjectController = Ember.ObjectController.extend

  needs: 'iterations'

  actions:

    didSelectProject: (project)->
      @transitionToRoute 'project', project.get('id')

    expandAllIterations: ->
      @get('controllers.iterations').send 'toggleIterations', true

    collapseAllIterations: ->
      @get('controllers.iterations').send 'toggleIterations', false
