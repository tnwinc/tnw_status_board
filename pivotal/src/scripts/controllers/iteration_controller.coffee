App.IterationController = Ember.ObjectController.extend

  hasStories: Ember.computed.gt 'stories.length', 0

  actions:

    toggleExpansion: ->
      @toggleProperty 'expanded'
      return
