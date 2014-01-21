window.App = Ember.Application.create()

App.VERSION = '0.1.0'

Ember.TextField.reopen
  attributeBindings: ['min']
