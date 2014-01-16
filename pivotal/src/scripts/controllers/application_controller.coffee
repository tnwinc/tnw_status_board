App.ApplicationController = Ember.Controller.extend

  actions:

    showBanner: (message, type)->
      @set 'banner', message: message, type: type

    hideBanner: ->
      @set 'banner', null
