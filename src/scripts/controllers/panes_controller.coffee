App.PanesController = Ember.ArrayController.extend

  actions:

    edit: ->
      @set 'editing', true

    close: ->
      @set 'editing', false

    editPane: ->
      @set 'editingPane', true

    endEditPane: ->
      @set 'editingPane', false
