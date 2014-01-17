App.MultiSelectComponent = Ember.Component.extend

  tagName: 'ul'

  classNames: ['multi-select']

  actions:

    selectItem: (item)->
      if item.selected
        numSelected = _.where(@get('items'), selected: true).length
        @sendAction 'onUnselect', item if numSelected > 1
      else
        @sendAction 'onSelect', item
