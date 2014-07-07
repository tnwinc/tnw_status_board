Ember = require 'ember'
App = require '../app'

App.SoundPlayerComponent = Ember.Component.extend

  tagName: 'audio'

  playSound: (->
    if @get 'play'
      @$().attr(src: @get('src'))[0].play()
      @set 'play', false
  ).observes 'play'
