Ember.Handlebars.helper 'story_icon', (storyType)->
  className = switch storyType
    when 'feature' then 'fa-certificate'
    when 'chore' then 'fa-wrench'
    when 'bug' then 'fa-bug'
    when 'release' then 'fa-flag-checkered'
  new Ember.Handlebars.SafeString "<i class='fa #{className}'></i>"
