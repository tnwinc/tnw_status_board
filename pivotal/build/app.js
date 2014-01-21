(function() {
  window.App = Ember.Application.create();

  Ember.TextField.reopen({
    attributeBindings: ['min']
  });

}).call(this);
