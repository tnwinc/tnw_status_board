App.PanesController = Ember.ArrayController.extend

  actions:

    edit: ->
      @set 'editing', true

    close: ->
      @set 'editing', false

    addPane: ->
      @get('model').addObject App.Pane.newOne()

    removePane: (pane)->
      @get('model').removeObject pane

    editPane: ->
      @set 'editingPane', true

    cancel: ->
      @set 'editingPane', false

    save: ->
      App.settings.updateValue 'panes', App.Pane.serialize @get('model')
      @set 'editingPane', false
