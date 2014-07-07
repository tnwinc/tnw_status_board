Ember = require 'ember'
App = require '../app'

App.IndexRoute = Ember.Route.extend

  redirect: ->
    @transitionTo 'panes'
