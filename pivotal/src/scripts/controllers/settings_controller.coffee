App.SettingsController = Ember.Controller.extend

  needs: 'application'

  init: ->
    @_super()

    baseFontSize = App.settings.getValue 'baseFontSize', 16
    @set 'baseFontSize', baseFontSize

    inProgressMax = App.settings.getValue 'inProgressMax', 5
    @set 'inProgressMax', inProgressMax

    showAcceptedType = App.settings.getValue 'showAcceptedType', 'number'
    @set 'showAcceptedType', showAcceptedType

    showAcceptedValue = App.settings.getValue 'showAcceptedValue', 2
    @set 'showAcceptedValue', showAcceptedValue

  showAcceptedTypes: ['number', 'date']

  showAcceptedPrefix: (->
    switch @get 'showAcceptedType'
      when 'number' then 'Show up to'
      when 'date' then 'Show accepted stories up to'
  ).property 'showAcceptedType'

  showAcceptedSuffix: (->
    switch @get 'showAcceptedType'
      when 'number' then 'accepted stories'
      when 'date' then 'days old'
  ).property 'showAcceptedType'

  actions:

    saveSettings: ->
      App.settings.updateNumber 'inProgressMax', @get('inProgressMax'), 5
      App.settings.updateNumber 'baseFontSize', @get('baseFontSize'), 16
      App.settings.updateString 'showAcceptedType', @get('showAcceptedType'), 'number'
      App.settings.updateNumber 'showAcceptedValue', @get('showAcceptedValue'), 2

      applicationController = @get 'controllers.application'
      applicationController.send 'closeSettings'
