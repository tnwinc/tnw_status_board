App.ScopesController = Ember.ArrayController.extend

  actions:

    toggleExpansion: (iteration)->
      iteration.toggleProperty 'expanded'
      return

    expandAll: (scope)->
      _.each scope.get('iterations'), (iteration)->
        iteration.set 'expanded', true

    collapseAll: (scope)->
      _.each scope.get('iterations'), (iteration)->
        iteration.set 'expanded', false
