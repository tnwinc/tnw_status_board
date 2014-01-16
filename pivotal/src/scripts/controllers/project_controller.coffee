App.ProjectController = Ember.ObjectController.extend

  attributeIterations: (->
    _.each @get('iterations'), (iteration)->
      iteration.set 'expanded', true
      iteration.set 'hasStories', iteration.get('stories.length')
  ).observes 'iterations'

  actions:

    didSelectProject: (project)->
      @transitionToRoute 'project', project.get('id')

    toggleExpansion: (iteration)->
      iteration.toggleProperty 'expanded'
      return
