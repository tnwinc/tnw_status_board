App.PropertyEditorComponent = Ember.Component.extend

  tagName: 'li'
  classNames: ['property']

  autoFocus: (->
    if @get 'isNew'
      @$('.property-name').focus()
      @set 'isNew', false
  ).on 'didInsertElement'

  actions:

    remove: ->
      @sendAction 'onRemoval', @get('property')
