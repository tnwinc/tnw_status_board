Ember = require 'ember'
App = require '../app'

App.PaneView = Ember.View.extend

  classNameBindings: ['controller.beingEdited', 'controller.beingSwapped']
