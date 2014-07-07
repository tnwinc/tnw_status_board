Ember = require 'ember'
App = require '../app'

App.ApplicationController = Ember.Controller.extend

  actions:

    playSound: (src)->
      @set 'soundSrc', src
      @set 'soundPlay', true
