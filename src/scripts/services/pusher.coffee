App.Pusher = Ember.Object.extend

  init: ->
    pusher = new Pusher App.settings.getValue('pusherApiKey')
    @set 'channel', pusher.subscribe App.settings.getValue('slackChannelName')

  setupEvents: (callback)->
    channel = @get 'channel'
    for event, args of App.Pusher.events
      do (event, args)->
        handler = if _.isFunction args
          args
        else
          (data)->
            args = _.map args, (arg)-> data[arg]
            callback event, args...
        channel.bind event, handler

App.Pusher.reopenClass
  events:
    standup: ['duration']
    reload: []
