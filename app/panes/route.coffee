Ember = require 'ember'
App = require '../app'
Pane = require '../pane/pane_model'

require './controller'
require './panes'
require './view'

require '../pane/_pane-editor'
require '../pane/controller'
require '../pane/pane'
require '../pane/view'

require '../settings/controller'
require '../settings/settings'

App.PanesRoute = Ember.Route.extend

  model: ->
    Pane.deserialize @store.fetch('panes')
