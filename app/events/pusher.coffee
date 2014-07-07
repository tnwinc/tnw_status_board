Ember = require 'ember'
App = require '../app'
_ = require 'lodash'
Pusher = require 'pusher'
events = require './events'

App.PusherController = Ember.Controller.extend

  needs: ['application', 'panes']

  setup: (->
    pusherApiKey = @store.fetch 'pusherApiKey'
    if pusherApiKey
      pusher = new Pusher pusherApiKey
      @set 'pusher', pusher
      @_subscribeToChannel @_channelNameFromSettings()

    App.eventBus.on 'pusherApiKeyUpdated', @_apiKeyUpdated.bind(this)
    App.eventBus.on 'slackChannelNameUpdated', @_channelNameUpdated.bind(this)
  ).on 'init'

  setupEvents: ->
    channel = @get 'channel'
    if channel
      _.each events, (handler, event)=>
        fn = if _.isFunction handler
          handler
        else
          (data)->
            args = _.map handler, (arg)-> encodeURIComponent data[arg]
            Ember.run => @transitionToRoute "panes.#{event}", args...

        channel.bind event, fn.bind(this)

  _apiKeyUpdated: (apiKey)->
    if apiKey
      @set 'pusher', new Pusher apiKey
      @_resubscribeToChannel @_channelNameFromSettings()

  _channelNameUpdated: (channelName)->
    @_resubscribeToChannel channelName.toLowerCase()

  _channelNameFromSettings: ->
    @store.fetch('slackChannelName').toLowerCase()

  _subscribeToChannel: (channelName)->
    if channelName
      @set 'channel', @get('pusher').subscribe(channelName)

  _resubscribeToChannel: (channelName)->
    @get('channel')?.unbind()
    @_subscribeToChannel channelName
    @setupEvents()
