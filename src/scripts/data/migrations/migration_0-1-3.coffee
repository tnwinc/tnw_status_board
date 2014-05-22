App.migrator.registerMigration '0.1.3', ->

  new Ember.RSVP.Promise (resolve)->
    console.log 'running migration for version 0.1.3'

    panes = App.settings.getValue 'panes'
    for pane, index in panes
      pane.id = index
    App.settings.updateValue 'panes', panes

    resolve()
