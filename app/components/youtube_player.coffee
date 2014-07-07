Ember = require 'ember'
App = require '../app'
YT = require 'youtube-iframe-api'

require './components.youtube-player'

youtubeReady = new Ember.RSVP.Promise (resolve)->
  window.onYouTubeIframeAPIReady = -> resolve()

App.YoutubePlayerComponent = Ember.Component.extend

  classNames: ['fullscreen']

  didInsertElement: ->
    youtubeReady.then =>
      @player = new YT.Player 'youtube-iframe',
        width: '100%'
        height: '100%'
        videoId: @get 'videoId'
        playerVars:
          autoplay: 1
        events:
          onStateChange: (e)=>
            if e.data is YT.PlayerState.ENDED
              @sendAction 'onFinish'
