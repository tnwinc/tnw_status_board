Ember = require 'ember'
App = require '../app'

App.PanesView = Ember.View.extend

  classNameBindings: [
    'controller.editing'
    'controller.editingPane'
    'controller.undoable'
    'controller.swapping'
    'controller.editingSettings'
    'controller.showingPaneIds'
  ]
