App.migrator.registerMigration '0.1.0', ->

  lsGet = (key)->
    JSON.parse(localStorage[key] || "null")

  new Ember.RSVP.Promise (resolve)->
    console.log 'running migration for version 0.1.0'

    topLeftUrl =
      id: uuid.v4()
      url: lsGet 'panes.topLeft'
      properties: [
        { name: 'top', value: 0 }
        { name: 'left', value: 0 }
        { name: 'width', value: '25%' }
        { name: 'height', value: '450px' }
      ]

    topMiddleUrl =
      id: uuid.v4()
      url: lsGet 'panes.topMiddle'
      properties: [
        { name: 'top', value: 0 }
        { name: 'left', value: '25%' }
        { name: 'width', value: '25%' }
        { name: 'height', value: '450px' }
      ]

    topRightUrl =
      id: uuid.v4()
      url: lsGet 'panes.topRight'
      properties: [
        { name: 'top', value: 0 }
        { name: 'right', value: 0 }
        { name: 'width', value: '50%' }
        { name: 'height', value: '450px' }
      ]

    bottomUrl =
      id: uuid.v4()
      url: lsGet 'panes.bottom'
      properties: [
        { name: 'top', value: '450px' }
        { name: 'left', value: 0 }
        { name: 'right', value: 0 }
        { name: 'bottom', value: 0 }
      ]

    App.settings.updateValue 'panes', [topLeftUrl, topMiddleUrl, topRightUrl, bottomUrl]
    delete localStorage['panes.topLeft']
    delete localStorage['panes.topMiddle']
    delete localStorage['panes.topRight']
    delete localStorage['panes.bottom']
    resolve()
