$body = Ember.$('body')

App.ApplicationController = Ember.Controller.extend Ember.Evented,

  needs: 'settings'

  init: ->
    @_super()

    @updateBaseFontSize()
    Ember.run.later => @set 'fullscreen', true

  handleFullscreen: (->
    action = if @get 'fullscreen' then 'addClass' else 'removeClass'
    Ember.$('body')[action]('fullscreen')
  ).observes 'fullscreen'

  updateBaseFontSize: (->
    baseFontSize = @get 'controllers.settings.baseFontSize'
    $body.css 'font-size', "#{baseFontSize}px"
  ).observes 'controllers.settings.baseFontSize'

  actions:

    showBanner: (message, type)->
      @set 'banner', message: message, type: type

    hideBanner: ->
      @set 'banner', null

    toggleFullscreen: ->
      @toggleProperty 'fullscreen'
      return

    openSettings: ->
      @set 'settingsOpen', true

    closeSettings: ->
      @set 'settingsOpen', false
      @trigger 'settingsUpdated'
