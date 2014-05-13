App.PaneController = Ember.ObjectController.extend

  style: (->
    properties = _.map @get('properties'), (property)->
      "#{property.name}: #{property.value}#{property.units};"
    properties.join ' '
  ).property 'properties'
