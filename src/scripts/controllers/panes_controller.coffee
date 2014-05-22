App.PanesController = Ember.ArrayController.extend

  _removeUndo: ->
    clearTimeout @get('dismissTimeout')
    @set 'undoable', false
    @set 'deletedPane', null

  _savePanes: ->
    App.settings.updateValue 'panes', App.Pane.serialize @get('model')

  _doneEditingPane: ->
    @set 'newPane', null
    @set 'editingPane', false

  actions:

    edit: ->
      @set 'editing', true

    close: ->
      @set 'editing', false

    addPane: ->
      newPane = App.Pane.newOne()
      @set 'newPane', newPane
      @get('model').addObject newPane

    removePane: (pane)->
      @set 'newPane', null
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
      if newPane = @get 'newPane'
        @get('model').removeObject newPane
      @_doneEditingPane()

    save: ->
      @_savePanes()
      @_doneEditingPane()

    swap: (url, callback)->
      if @get 'swapping'
        swap = @get 'swap'
        callback swap.url
        swap.callback url
        @set 'swapping', false
        @set 'swap', null
      else
        @set 'swapping', true
        @set 'swap', url: url, callback: callback

    cancelSwap: ->
      @get('swap').callback()
      @set 'swapping', false
      @set 'swap', null

    openSettings: ->
      @set 'editingSettings', true

    closeSettings: ->
      @set 'editingSettings', false

    showPaneIds: ->
      @set 'showingPaneIds', true

    setPaneUrl: (paneId, url)->
      paneId = parseInt paneId, 10
      pane = _.find @get('model'), (pane)-> pane.get('id') is paneId
      if pane
        pane.set 'url', url
        @_savePanes()
      @set 'showingPaneIds', false
