App.migrator.registerMigration '0.1.0', ->

  lsGet = (key)->
    JSON.parse localStorage[key] || "null"

  new Ember.RSVP.Promise (resolve)->
    console.log 'running migration for version 0.1.0'

    topLeftUrl =
      url: lsGet 'panes.topLeft'
      properties:
        top: value: 0, units: 'px'
        left: value: 0, units: 'px'
        width: value: 25, units: '%'
        height: value: 450, units: 'px'

    topMiddleUrl =
      url: lsGet 'panes.topMiddle'
      properties:
        top: value: 0, units: 'px'
        left: value: 25, units: '%'
        width: value: 25, units: '%'
        height: value: 450, units: 'px'

    topRightUrl =
      url: lsGet 'panes.topRight'
      properties:
        top: value: 0, units: 'px'
        right: value: 0, units: 'px'
        width: value: 50, units: '%'
        height: value: 450, units: 'px'

    bottomUrl =
      url: lsGet 'panes.bottom'
      properties:
        top: value: 450, units: 'px'
        left: value: 0, units: 'px'
        right: value: 0, units: 'px'
        bottom: value: 0, units: 'px'

    App.settings.updateValue 'panes', [topLeftUrl, topMiddleUrl, topRightUrl, bottomUrl]
    delete localStorage['panes.topLeft']
    delete localStorage['panes.topMiddle']
    delete localStorage['panes.topRight']
    delete localStorage['panes.bottom']
    resolve()
