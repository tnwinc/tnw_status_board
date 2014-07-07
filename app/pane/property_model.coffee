Ember = require 'ember'
App = require '../app'
_ = require 'lodash'

Property = Ember.Object.extend

  serialize: ->
    name: @get 'name'
    value: @get 'value'

Property.reopenClass

  serialize: (properties)->
    _.map properties, (property)-> property.serialize()

  deserialize: (properties)->
    _.map properties, (property)-> Property.create property

  newOne: ->
    Property.create
      name: ''
      value: ''
      isNew: true

module.exports = Property
