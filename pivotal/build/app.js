(function() {
  window.App = Ember.Application.create();

  App.VERSION = '0.1.1';

  Ember.TextField.reopen({
    attributeBindings: ['min']
  });

}).call(this);
