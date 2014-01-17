Ember.Handlebars.helper 'story_state', (state)->
  if state
    el = """
          <span class="state-meter"></span>
          <span class="state">#{state}</span>
         """
    new Ember.Handlebars.SafeString el
