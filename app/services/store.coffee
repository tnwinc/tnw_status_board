Ember = require 'ember'
App = require '../app'

Store = Ember.Object.extend

  init: ->
    @data = JSON.parse(localStorage[App.NAMESPACE] or '{}')

  fetch: (key)->
    @data[key]

  save: (key, value)->
    @data[key] = value
    localStorage[App.NAMESPACE] = JSON.stringify @data
    value

Ember.Application.initializer
  name: 'store'

  initialize: (container, application)->
    container.register 'store:main', Store

    application.inject 'controller', 'store', 'store:main'
    application.inject 'route', 'store', 'store:main'
