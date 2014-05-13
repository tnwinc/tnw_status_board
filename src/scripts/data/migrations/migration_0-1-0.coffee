App.migrator.registerMigration '0.1.0', ->

  lsGet = (key)->
    JSON.parse localStorage[key] || "null"

  new Ember.RSVP.Promise (resolve)->
    console.log 'running migration for version 0.1.0'

    topLeftUrl =
      url: lsGet 'panes.topLeft'
      properties: [
        { name: 'top', value: 0, units: 'px' }
        { name: 'left', value: 0, units: 'px' }
        { name: 'width', value: 25, units: '%' }
        { name: 'height', value: 450, units: 'px' }
      ]

    topMiddleUrl =
      url: lsGet 'panes.topMiddle'
      properties: [
        { name: 'top', value: 0, units: 'px' }
        { name: 'left', value: 25, units: '%' }
        { name: 'width', value: 25, units: '%' }
        { name: 'height', value: 450, units: 'px' }
      ]

    topRightUrl =
      url: lsGet 'panes.topRight'
      properties: [
        { name: 'top', value: 0, units: 'px' }
        { name: 'right', value: 0, units: 'px' }
        { name: 'width', value: 50, units: '%' }
        { name: 'height', value: 450, units: 'px' }
      ]

    bottomUrl =
      url: lsGet 'panes.bottom'
      properties: [
        { name: 'top', value: 450, units: 'px' }
        { name: 'left', value: 0, units: 'px' }
        { name: 'right', value: 0, units: 'px' }
        { name: 'bottom', value: 0, units: 'px' }
      ]

    App.settings.updateValue 'panes', [topLeftUrl, topMiddleUrl, topRightUrl, bottomUrl]
    delete localStorage['panes.topLeft']
    delete localStorage['panes.topMiddle']
    delete localStorage['panes.topRight']
    delete localStorage['panes.bottom']
    resolve()
