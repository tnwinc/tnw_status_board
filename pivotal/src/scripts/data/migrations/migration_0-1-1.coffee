App.migrator.registerMigration '0.1.1', ->

  new Ember.RSVP.Promise (resolve)->
    console.log 'running migration for version 0.1.1'

    conversionMap =
      'number': 'count'
      'date': 'age'

    showAcceptedType = App.settings.getValue 'showAcceptedType', 'number'
    convertedType = conversionMap[showAcceptedType]
    unless convertedType
      convertedType = 'count'
    localStorage.showAcceptedType = JSON.stringify convertedType

    resolve()
