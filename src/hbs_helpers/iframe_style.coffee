define ['lib/handlebars'], (Handlebars)->

  Handlebars.registerHelper 'iframe_style', (properties)->
    _.reduce properties, (style, property)->
      style + "#{property.name}: #{property};"
    , ''
