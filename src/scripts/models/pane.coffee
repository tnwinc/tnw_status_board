App.Pane = Ember.Object.extend

  init: ->
    @set 'properties', App.Property.deserialize @get('properties')

  serialize: ->
    id: @get 'id'
    url: @get 'url'
    sandboxed: @get 'sandboxed'
    properties: App.Property.serialize @get('properties')

App.Pane.reopenClass

  serialize: (panes)->
    _.map panes, (pane)-> pane.serialize()

  deserialize: (panes)->
    _.map panes, (pane)-> App.Pane.create pane

  newOne: ->
    highestId = _.max _.pluck(App.settings.getValue('panes'), 'id')
    App.Pane.create
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
