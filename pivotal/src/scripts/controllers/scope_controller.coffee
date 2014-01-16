App.ScopeController = Ember.ObjectController.extend

  actions:

    expandAll: ->
      _.each @get('iterations'), (iteration)->
        iteration.set 'expanded', true

    collapseAll: ->
      _.each @get('iterations'), (iteration)->
        iteration.set 'expanded', false
