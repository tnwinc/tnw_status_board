Ember = require 'ember'
uuid = require 'uuid'

module.exports = Ember.Object.extend

  run: ->
    new Ember.RSVP.Promise (resolve)=>

      topLeftUrl =
        id: uuid.v4()
        url: localStorage['panes.topLeft']
        properties: [
          { name: 'top', value: 0 }
          { name: 'left', value: 0 }
          { name: 'width', value: '25%' }
          { name: 'height', value: '450px' }
        ]

      topMiddleUrl =
        id: uuid.v4()
        url: localStorage['panes.topMiddle']
        properties: [
          { name: 'top', value: 0 }
          { name: 'left', value: '25%' }
          { name: 'width', value: '25%' }
          { name: 'height', value: '450px' }
        ]

      topRightUrl =
        id: uuid.v4()
        url: localStorage['panes.topRight']
        properties: [
          { name: 'top', value: 0 }
          { name: 'right', value: 0 }
          { name: 'width', value: '50%' }
          { name: 'height', value: '450px' }
        ]

      bottomUrl =
        id: uuid.v4()
        url: localStorage['panes.bottom']
        properties: [
          { name: 'top', value: '450px' }
          { name: 'left', value: 0 }
          { name: 'right', value: 0 }
          { name: 'bottom', value: 0 }
        ]

      @get('store').save 'panes', [topLeftUrl, topMiddleUrl, topRightUrl, bottomUrl]
      delete localStorage['panes.topLeft']
      delete localStorage['panes.topMiddle']
      delete localStorage['panes.topRight']
      delete localStorage['panes.bottom']
      resolve()
