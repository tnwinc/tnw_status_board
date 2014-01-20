Ember.Handlebars.helper 'markdown', (str)->
  new Ember.Handlebars.SafeString markdown.toHTML str