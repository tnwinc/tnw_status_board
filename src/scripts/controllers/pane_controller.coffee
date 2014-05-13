App.PaneController = Ember.ObjectController.extend

  style: (->
    properties = _.map @get('properties'), (value, property)->
      "#{property}: #{value.value}#{value.units};"
    properties.join ' '
  ).property 'properties'
