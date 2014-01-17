App.SettingsController = Ember.Controller.extend

  needs: 'application'

  init: ->
    @_super()

    baseFontSize = App.settings.getValue 'baseFontSize', 16
    @set 'baseFontSize', baseFontSize
    @get('controllers.application').send 'updateBaseFontSize', baseFontSize

    inProgressMax = App.settings.getValue 'inProgressMax', 5
    @set 'inProgressMax', inProgressMax

  updateBaseFontSize: (->
    @get('controllers.application').send 'updateBaseFontSize', @get('baseFontSize')
  ).observes 'baseFontSize'

  actions:

    saveSettings: ->
      App.settings.updateNumber 'inProgressMax', @get('inProgressMax'), 5
      baseFontSize = App.settings.updateNumber 'baseFontSize', @get('baseFontSize'), 16

      applicationController = @get 'controllers.application'
      applicationController.send 'updateBaseFontSize', baseFontSize
      applicationController.send 'closeSettings'
