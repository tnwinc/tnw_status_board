App.PropertyEditorComponent = Ember.Component.extend

  tagName: 'li'

  autoFocus: (->
    if @get 'isNew'
      @$('.property-name').focus()
  ).on 'didInsertElement'
