App.PanesController = Ember.ArrayController.extend

  actions:

    edit: ->
      @set 'editing', true

    close: ->
      @set 'editing', false

    editPane: ->
      @set 'editingPane', true

    save: ->
      App.settings.updateValue 'panes', App.Pane.serialize @get('model')
      @set 'editingPane', false
