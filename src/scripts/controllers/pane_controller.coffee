App.PaneController = Ember.ObjectController.extend

  needs: 'panes'

  style: (->
    properties = _.map @get('properties'), (property)->
      "#{property.get('name')}: #{property.get('value')};"
    properties.join ' '
  ).property 'properties.@each.name', 'properties.@each.value'

  actions:

    edit: ->
      @set 'beingEdited', true
      @get('controllers.panes').send 'editPane'

    addProperty: ->
      @get('properties').addObject App.Property.newOne()

    removeProperty: (property)->
      @get('properties').removeObject property

    save: ->
      @set 'beingEdited', false
      @get('controllers.panes').send 'save'
