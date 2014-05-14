App.PaneController = Ember.ObjectController.extend

  style: (->
    properties = _.map @get('properties'), (property)->
      "#{property.get('name')}: #{property.get('value')}#{property.get('units')};"
    properties.join ' '
  ).property 'properties.@each'
