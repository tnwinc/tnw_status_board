App.SettingsController = Ember.Controller.extend

  needs: 'application'

  init: ->
    @_super()

    baseFontSize = App.settings.getValue 'baseFontSize', 16
    @set 'baseFontSize', baseFontSize

    inProgressMax = App.settings.getValue 'inProgressMax', 5
    @set 'inProgressMax', inProgressMax

    showAcceptedType = App.settings.getValue 'showAcceptedType', 'count'
    @set 'showAcceptedType', showAcceptedType

    showAcceptedValue = App.settings.getValue 'showAcceptedValue', 2
    @set 'showAcceptedValue', showAcceptedValue

  showAcceptedTypes: ['count', 'age']

  showAcceptedPrefix: (->
    switch @get 'showAcceptedType'
      when 'count' then 'Show up to'
      when 'age' then 'Show accepted stories up to'
  ).property 'showAcceptedType'

  showAcceptedSuffix: (->
    if @get('showAcceptedValue') is 1
      inflectedStory = 'story'
      inflectedDay = 'day'
    else
      inflectedStory = 'stories'
      inflectedDay = 'days'

    switch @get 'showAcceptedType'
      when 'count' then "accepted #{inflectedStory}"
      when 'age' then "#{inflectedDay} old"
  ).property 'showAcceptedType', 'showAcceptedValue'

  actions:

    saveSettings: ->
      App.settings.updateNumber 'inProgressMax', @get('inProgressMax'), 5
      App.settings.updateNumber 'baseFontSize', @get('baseFontSize'), 16
      App.settings.updateString 'showAcceptedType', @get('showAcceptedType'), 'count'
      App.settings.updateNumber 'showAcceptedValue', @get('showAcceptedValue'), 2

      applicationController = @get 'controllers.application'
      applicationController.send 'closeSettings'
