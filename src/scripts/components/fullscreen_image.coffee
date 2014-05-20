App.FullscreenImageComponent = Ember.Component.extend

  tagName: 'img'
  attributeBindings: ['src']

  didInsertElement: ->
    el = @$()
    el.on 'load', ->
      el.css width: 'auto', height: 'auto'
      largerDimension = if el.height() > el.width() then 'height' else 'width'
      el.css largerDimension, '100%'
