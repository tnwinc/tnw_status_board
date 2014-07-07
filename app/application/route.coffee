Ember = require 'ember'
App = require '../app'
Migrator = require '../services/migrator/migrator'

require './application'
require './controller'

App.ApplicationRoute = Ember.Route.extend

  beforeModel: ->
    Migrator.create(store: @store).runMigrations()

  afterModel: ->
    @controllerFor('pusher').setupEvents()
