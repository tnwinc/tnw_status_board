App.ApplicationController = Ember.Controller.extend

  init: ->
    @_super()
    @set 'fullscreen', true
    Ember.$('body').addClass 'fullscreen'

  handleFullscreen: (->
    action = if @get 'fullscreen' then 'addClass' else 'removeClass'
    Ember.$('body')[action]('fullscreen')
  ).observes 'fullscreen'

  actions:

    showBanner: (message, type)->
      @set 'banner', message: message, type: type

    hideBanner: ->
      @set 'banner', null

    toggleFullscreen: ->
      @toggleProperty 'fullscreen'
      return
