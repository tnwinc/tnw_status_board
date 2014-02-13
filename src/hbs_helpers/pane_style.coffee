define ['lib/handlebars'], (Handlebars)->

  Handlebars.registerHelper 'pane_style', (properties)->
    _.reduce properties, (style, property)->
      style + "#{property.name}: #{property};"
    , ''
