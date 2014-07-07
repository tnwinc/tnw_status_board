Ember = require 'ember'
App = require '../app'

EventBus = Ember.Object.extend Ember.Evented

App.eventBus = EventBus.create()
