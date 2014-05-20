App.PusherController = Ember.Controller.extend

  needs: ['application']

  setup: (->
    pusher = new Pusher App.settings.getValue('pusherApiKey')
    @set 'pusher', pusher
    @set 'channel', pusher.subscribe App.settings.getValue('slackChannelName')

    App.eventBus.on 'pusherApiKeyUpdated', @_apiKeyUpdated.bind(this)
    App.eventBus.on 'slackChannelNameUpdated', @_channelNameUpdated.bind(this)
  ).on 'init'

  setupEvents: ->
    channel = @get 'channel'
    _.each App.pusherEvents, (handler, event)=>
      fn = if _.isFunction handler
        handler
      else
        (data)->
          args = _.map handler, (arg)-> encodeURIComponent data[arg]
          Ember.run => @transitionToRoute "panes.#{event}", args...
      channel.bind event, fn.bind(this)

  _apiKeyUpdated: (apiKey)->
    @set 'pusher', new Pusher apiKey
    @_rebindToChannel App.settings.getValue('slackChannelName')

  _channelNameUpdated: (channelName)->
    @_rebindToChannel channelName

  _rebindToChannel: (channelName)->
    @get('channel').unbind()
    @set 'channel', @get('pusher').subscribe channelName
    @setupEvents()
