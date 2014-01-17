App.ApplicationController = Ember.Controller.extend Ember.Evented,

  init: ->
    @_super()
    @set 'fullscreen', true
    Ember.$('body').addClass 'fullscreen'

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
      @set 'settingsOpen', false
      @trigger 'settingsUpdated'
