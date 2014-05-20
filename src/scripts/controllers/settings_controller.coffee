App.SettingsController = Ember.ObjectController.extend

  needs: ['panes']

  content: {}

  keys: ['pusherApiKey', 'slackChannelName', 'standupUrl']

  setup: (->
    @_initValue key for key in @get('keys')
  ).on 'init'

  _initValue: (key)->
    value = App.settings.getValue key
    @set key, value
    @set "original_#{key}", value

  _saveAndBroadcastValue: (key)->
    value = @get key
    if value isnt @get("original_#{key}")
      App.eventBus.trigger "#{key}Updated", value
      @set "original_#{key}", value
      App.settings.updateValue key, value

  actions:

    save: ->
      @_saveAndBroadcastValue(key) for key in @get('keys')
      @get('controllers.panes').send 'closeSettings'
