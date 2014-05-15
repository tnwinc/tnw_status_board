App.PaneController = Ember.ObjectController.extend

  startEditing: (->
    if @get('isNew')
      @set 'isNew', false
      @send 'edit'
  ).on 'init'

  needs: 'panes'

  style: (->
    properties = _.map @get('properties'), (property)->
      "#{property.get('name')}: #{property.get('value')};"
    properties.join ' '
  ).property 'properties.@each.name', 'properties.@each.value'

  _doneEditing: ->
    @set 'original', null
    @set 'beingEdited', false

  actions:

    edit: ->
      @set 'original', @get('model').serialize()
      @set 'beingEdited', true
      @get('controllers.panes').send 'editPane'

    swap: ->
      unless @get 'beingSwapped'
        @set 'beingSwapped', true
        @get('controllers.panes').send 'swap', @get('url'), (url)=>
          @set 'beingSwapped', false
          if url
            @set 'url', url
            @get('controllers.panes').send 'save'

    addProperty: ->
      @get('properties').addObject App.Property.newOne()

    removeProperty: (property)->
      @get('properties').removeObject property

    cancel: ->
      original = @get 'original'
      @set 'url', original.url
      @set 'properties', App.Property.deserialize original.properties
      @_doneEditing()
      @get('controllers.panes').send 'cancel'

    save: ->
      @_doneEditing()
      @get('controllers.panes').send 'save'

    remove: ->
      @set 'beingEdited', false
      @get('controllers.panes').send 'removePane', @get('model')
      @get('controllers.panes').send 'save'
