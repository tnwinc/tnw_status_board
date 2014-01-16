Ember.Handlebars.helper 'expando_icon', (expanded)->
  className = if expanded
    "fa-caret-up"
  else
    "fa-caret-down"
  new Ember.Handlebars.SafeString "<i class='fa #{className}'></i>"
