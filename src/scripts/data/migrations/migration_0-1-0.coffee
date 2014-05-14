App.migrator.registerMigration '0.1.0', ->

  lsGet = (key)->
    JSON.parse(localStorage[key] || "null")

  new Ember.RSVP.Promise (resolve)->
    console.log 'running migration for version 0.1.0'

    topLeftUrl =
      id: uuid.v4()
      url: lsGet 'panes.topLeft'
      properties: [
        { name: 'top', value: 0, units: '' }
        { name: 'left', value: 0, units: '' }
        { name: 'width', value: 25, units: '%' }
        { name: 'height', value: 450, units: 'px' }
      ]

    topMiddleUrl =
      id: uuid.v4()
      url: lsGet 'panes.topMiddle'
      properties: [
        { name: 'top', value: 0, units: '' }
        { name: 'left', value: 25, units: '%' }
        { name: 'width', value: 25, units: '%' }
        { name: 'height', value: 450, units: 'px' }
      ]

    topRightUrl =
      id: uuid.v4()
      url: lsGet 'panes.topRight'
      properties: [
        { name: 'top', value: 0, units: '' }
        { name: 'right', value: 0, units: '' }
        { name: 'width', value: 50, units: '%' }
        { name: 'height', value: 450, units: 'px' }
      ]

    bottomUrl =
      id: uuid.v4()
      url: lsGet 'panes.bottom'
      properties: [
        { name: 'top', value: 450, units: 'px' }
        { name: 'left', value: 0, units: '' }
        { name: 'right', value: 0, units: '' }
        { name: 'bottom', value: 0, units: '' }
      ]

    App.settings.updateValue 'panes', [topLeftUrl, topMiddleUrl, topRightUrl, bottomUrl]
    delete localStorage['panes.topLeft']
    delete localStorage['panes.topMiddle']
    delete localStorage['panes.topRight']
    delete localStorage['panes.bottom']
    resolve()
