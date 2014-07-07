Ember = require 'ember'

module.exports = Ember.Object.extend

  run: ->
    new Ember.RSVP.Promise (resolve)=>

      panes = @get('store').fetch 'panes'
      for pane, index in panes
        pane.id = index
      @get('store').save 'panes', panes

      resolve()
