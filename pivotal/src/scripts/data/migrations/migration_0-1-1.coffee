App.migrator.registerMigration '0.1.1', ->

  new Ember.RSVP.Promise (resolve)->
    console.log 'running migration for version 0.1.1'

    conversionMap =
      'number': 'count'
      'date': 'age'
      'count': 'count'
      'age': 'age'

    showAcceptedType = App.settings.getValue 'showAcceptedType', 'number'
    localStorage.showAcceptedType = JSON.stringify conversionMap[showAcceptedType]

    resolve()
