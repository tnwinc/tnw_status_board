App.Property = Ember.Object.extend

  serialize: ->
    name: @get 'name'
    value: @get 'value'

App.Property.reopenClass

  serialize: (properties)->
    _.map properties, (property)-> property.serialize()

  deserialize: (properties)->
    _.map properties, (property)-> App.Property.create property

  newOne: ->
    App.Property.create
      name: ''
      value: ''
      isNew: true
