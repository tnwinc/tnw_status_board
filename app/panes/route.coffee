Ember = require 'ember'
App = require '../app'
Pane = require '../pane/pane_model'
_ = require 'lodash'

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

  setupController: (controller, model)->
    @_super controller, model

    populatedPanes = _.filter model, (pane)->
      not _.isEmpty pane.get('url')

    unless populatedPanes.length
      controller.send 'edit'
