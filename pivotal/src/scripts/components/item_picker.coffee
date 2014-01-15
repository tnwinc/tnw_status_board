App.ItemPickerComponent = Ember.Component.extend

  curatedItems: (->
    withCurrent =_.map @get('items'), (item)=>
      item.set('current', @get('currentItemId') is item.get('id'))
    withCurrent.sort (a, b)->
      b.get('current') - a.get('current')
  ).property 'items', 'currentItemId'

  actions:

    selectItem: (item)->
      @sendAction 'onSelect', item if not item.get('current')
