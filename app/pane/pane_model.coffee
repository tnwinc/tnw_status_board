Ember = require 'ember'
App = require '../app'
Property = require './property_model'
_ = require 'lodash'

Pane = Ember.Object.extend

  init: ->
    @set 'properties', Property.deserialize @get('properties')

  serialize: ->
    id: @get 'id'
    url: @get 'url'
    sandboxed: @get 'sandboxed'
    properties: Property.serialize @get('properties')

Pane.reopenClass

  serialize: (panes)->
    _.map panes, (pane)-> pane.serialize()

  deserialize: (panes)->
    _.map panes, (pane)-> Pane.create pane

  newOne: (panes)->
    highestId = _.max _.pluck(panes, 'id')
    Pane.create
      id: highestId + 1
      url: ''
      sandboxed: true
      isNew: true
      properties: [
        { name: 'top', value: '20px' }
        { name: 'right', value: '20px' }
        { name: 'width', value: '300px' }
        { name: 'height', value: '200px' }
      ]

module.exports = Pane
