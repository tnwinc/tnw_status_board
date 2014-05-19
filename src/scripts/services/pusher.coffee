App.pusherEvents =
  standup: ['duration']
  youtube: ['id']
  reload: ->
    @transitionToRoute 'panes'
    Ember.run.later -> location.reload true
  sound: (data)->
    @get('controllers.application').send 'playSound', data.url

App.PusherController = Ember.Controller.extend

  needs: ['application']

  init: ->
    pusher = new Pusher App.settings.getValue('pusherApiKey')
    @set 'channel', pusher.subscribe App.settings.getValue('slackChannelName')

  setupEvents: (callback)->
    channel = @get 'channel'
    for event, args of App.pusherEvents
      do (event, args)=>
        handler = if _.isFunction args
          args
        else
          (data)->
            args = _.map args, (arg)-> data[arg]
            callback event, args...
        channel.bind event, handler.bind(this)
