App.migrator.registerMigration '0.1.2', ->

  new Ember.RSVP.Promise (resolve)->
    console.log 'running migration for version 0.1.2'

    App.settings.updateString 'standupUrl', 'http://labs.tnwinc.com/storyboard'

    resolve()
