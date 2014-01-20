App.ProjectController = Ember.ObjectController.extend

  actions:

    didSelectProject: (project)->
      @transitionToRoute 'project', project.get('id')

    expandAllIterations: ->
      _.each @get('iterations'), (iteration)->
        iteration.set 'expanded', true

    collapseAllIterations: ->
      _.each @get('iterations'), (iteration)->
        iteration.set 'expanded', false

    toggleExpansion: (iteration)->
      iteration.toggleProperty 'expanded'
      return
