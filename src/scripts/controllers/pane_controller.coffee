App.PaneController = Ember.ObjectController.extend

  needs: 'panes'

  style: (->
    properties = _.map @get('properties'), (property)->
      "#{property.get('name')}: #{property.get('value')}#{property.get('units')};"
    properties.join ' '
  ).property 'properties.@each.name', 'properties.@each.value', 'properties.@each.units'

  actions:

    edit: ->
      @set 'beingEdited', true
      @get('controllers.panes').send 'editPane'

    save: ->
      @set 'beingEdited', false
      @get('controllers.panes').send 'endEditPane'

    cancel: ->
      @set 'beingEdited', false
      @get('controllers.panes').send 'endEditPane'
