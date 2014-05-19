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
    _.each App.pusherEvents, (handler, event)=>
      fn = if _.isFunction handler
        handler
      else
        (data)->
          args = _.map handler, (arg)-> data[arg]
          callback event, args...
      channel.bind event, fn.bind(this)
