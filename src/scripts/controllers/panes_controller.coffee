App.PanesController = Ember.ArrayController.extend

  actions:

    edit: ->
      @set 'editing', true

    save: ->
      @set 'editing', false
