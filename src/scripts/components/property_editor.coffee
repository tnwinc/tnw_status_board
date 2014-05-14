App.PropertyEditorComponent = Ember.Component.extend

  tagName: 'li'
  classNames: ['property']

  autoFocus: (->
    if @get 'isNew'
      @$('.property-name').focus()
  ).on 'didInsertElement'

  actions:

    remove: ->
      @sendAction 'onRemoval', @get('property')
