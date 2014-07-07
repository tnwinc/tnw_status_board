Ember = require 'ember'
App = require '../app'

App.SettingsController = Ember.ObjectController.extend

  needs: ['panes']

  content: {}

  keys: ['pusherApiKey', 'slackChannelName', 'standupUrl']

  setup: (->
    @_initValue key for key in @get('keys')
  ).on 'init'

  _initValue: (key)->
    value = @store.fetch key
    @set key, value
    @set "original_#{key}", value

  _saveAndBroadcastValue: (key)->
    value = @get key
    if value isnt @get("original_#{key}")
      @set "original_#{key}", value
      @store.save key, value
      App.eventBus.trigger "#{key}Updated", value

  actions:

    save: ->
      @_saveAndBroadcastValue(key) for key in @get('keys')
      @get('controllers.panes').send 'closeSettings'

    cancel: ->
      for key in @get('keys')
        @set key, @get("original_#{key}")
      @get('controllers.panes').send 'closeSettings'
