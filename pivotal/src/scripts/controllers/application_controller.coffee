$body = Ember.$('body')

App.ApplicationController = Ember.Controller.extend Ember.Evented,

  init: ->
    @_super()

    baseFontSize = App.settings.getValue 'baseFontSize', 16
    @send 'updateBaseFontSize', baseFontSize

    @set 'fullscreen', true
    $body.addClass 'fullscreen'

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

    openSettings: ->
      @set 'settingsOpen', true

    closeSettings: ->
      @set 'settingsOpen', false
      @trigger 'settingsUpdated'

    updateBaseFontSize: (baseFontSize)->
      $body.css 'font-size', "#{baseFontSize}px"
