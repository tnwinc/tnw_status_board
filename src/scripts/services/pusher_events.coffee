App.pusherEvents =
  image: ['url', 'duration']
  standup: ['duration']
  url: ['url', 'duration']
  youtube: ['id']
  reload: ->
    @transitionToRoute 'panes'
    Ember.run.later -> location.reload true
  sound: (data)->
    @get('controllers.application').send 'playSound', data.url
