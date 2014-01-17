$body = Ember.$('body')

App.ApplicationController = Ember.Controller.extend Ember.Evented,

  init: ->
    @_super()

    @set 'fullscreen', true
    $body.addClass 'fullscreen'

    baseFontSize = localStorage.baseFontSize
    unless baseFontSize
      localStorage.baseFontSize = baseFontSize = JSON.stringify 16
    @set 'baseFontSize', JSON.parse baseFontSize
    $body.css 'font-size', "#{baseFontSize}px"

    inProgressMax = localStorage.inProgressMax
    unless inProgressMax
      localStorage.inProgressMax = inProgressMax = JSON.stringify 5
    @set 'inProgressMax', JSON.parse inProgressMax

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

    saveSettings: ->
      inProgressMax = Number @get('inProgressMax')
      if _.isNaN inProgressMax
        inProgressMax = 5
        @set 'inProgressMax', 5
      localStorage.inProgressMax = JSON.stringify inProgressMax

      baseFontSize = Number @get('baseFontSize')
      if _.isNaN baseFontSize
        baseFontSize = 16
        @set 'inProgressMax', 16
      localStorage.baseFontSize = JSON.stringify baseFontSize
      $body.css 'font-size', "#{baseFontSize}px"

      @set 'settingsOpen', false
      @trigger 'settingsUpdated'
