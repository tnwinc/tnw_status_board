App.PanesController = Ember.ArrayController.extend

  _removeUndo: ->
    clearTimeout @get('dismissTimeout')
    @set 'undoable', false
    @set 'deletedPane', null

  actions:

    edit: ->
      @set 'editing', true

    close: ->
      @set 'editing', false

    addPane: ->
      @get('model').addObject App.Pane.newOne()

    removePane: (pane)->
      @set 'undoable', true
      @set 'deletedPane', pane
      @get('model').removeObject pane

      clearTimeout @get('dismissTimeout')
      @set 'dismissTimeout', setTimeout =>
        Ember.run => @_removeUndo()
      , 10000

    undo: ->
      @get('model').addObject @get('deletedPane')
      @send 'save'
      @_removeUndo()

    dismissUndo: ->
      @_removeUndo()

    editPane: ->
      @set 'editingPane', true

    cancel: ->
      @set 'editingPane', false

    save: ->
      App.settings.updateValue 'panes', App.Pane.serialize @get('model')
      @set 'editingPane', false
