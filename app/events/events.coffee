require './image/route'
require './standup/route'
require './text/route'
require './url/route'
require './youtube/route'

module.exports =
  image: ['url', 'duration']
  standup: ['duration']
  text: ['text', 'sender', 'duration']
  url: ['url', 'duration']
  youtube: ['id']

  reload: ->
    @transitionToRoute 'panes'
    Ember.run.later -> location.reload true

  seturl: (data)->
    panesController = @get 'controllers.panes'
    if data.paneId and data.url
      panesController.send 'setPaneUrl', data.paneId, data.url
    else
      panesController.send 'showPaneIds'

  sound: (data)->
    @get('controllers.application').send 'playSound', data.url
