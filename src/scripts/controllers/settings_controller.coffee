App.SettingsController = Ember.ObjectController.extend

  needs: ['panes']

  content: {}

  setup: (->
    @set 'pusherApiKey', App.settings.getValue('pusherApiKey')
    @set 'slackChannelName', App.settings.getValue('slackChannelName')
    @set 'standupUrl', App.settings.getValue('standupUrl')
  ).on 'init'

  actions:

    save: ->
      @get('controllers.panes').send 'closeSettings'
