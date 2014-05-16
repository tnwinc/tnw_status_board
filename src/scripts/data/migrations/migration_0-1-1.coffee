App.migrator.registerMigration '0.1.1', ->

  new Ember.RSVP.Promise (resolve)->
    console.log 'running migration for version 0.1.1'

    apiKey = prompt 'Please enter your Pusher API key'
    App.settings.updateString 'pusherApiKey', apiKey

    channelName = prompt 'Please enter the name of your Slack channel'
    App.settings.updateString 'slackChannelName', channelName

    resolve()
