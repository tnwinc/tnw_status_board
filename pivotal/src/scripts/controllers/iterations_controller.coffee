App.IterationsController = Ember.ArrayController.extend

  actions:

    toggleIterations: (expand)->
      _.each @get('model'), (iteration)->
        iteration.set 'expanded', expand
