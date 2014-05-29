App.CheckBoxComponent = Ember.Component.extend

  tagName: 'button'
  classNames: ['check-box']
  classNameBindings: ['checked']
  attributeBindings: ['type']
  type: 'button'

  click: ->
    @toggleProperty 'checked'
