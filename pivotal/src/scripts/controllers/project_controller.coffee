App.ProjectController = Ember.ObjectController.extend

  actions:

    didSelectProject: (project)->
      @transitionToRoute 'project', project.get('id')
