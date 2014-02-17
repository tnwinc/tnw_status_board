# require ['localstorage', 'callout', 'pane_manager'], (LS, callout, PaneManager)->

#   ls = new LS()
#   paneManager = new PaneManager()

#   unless key = ls.get 'pusher.api-key'
#     key = prompt('What is the pusher api key?')
#     ls.set 'pusher.api-key': key

#   Pusher.log = (message)-> console.log message

#   pusher = new Pusher(key)
#   channel = pusher.subscribe 'test_channel'

#   eventHandlers =

#     reload_board: (data)->
#       $('body').fadeOut -> location.reload()

#     start_standup: (minutes)->
#       console.log "Starting standup for #{minutes} minutes"
#       @play_sound 'http://soundfxnow.com/soundfx/MilitaryTrumpetTune1.mp3'
#       paneManager.standupPane().makeFullScreen()
#       if minutes
#         for reminderInterval in [ 0.75, 0.9, 0.95 ]
#           console.log "Setting reminder interval \
#                        for #{reminderInterval * minutes} minutes \
#                        (#{reminderInterval * minutes * 60} seconds)"
#           do (reminderInterval)=>
#             milliseconds = 1000 * 60 * reminderInterval * minutes
#             setTimeout =>
#               @play_sound 'http://soundfxnow.com/soundfx/GameshowBellDing2.mp3'
#             , milliseconds

#         millisecondsUntilStandupEnds = 1000 * 60 * minutes
#         setTimeout ->
#           end_standup()
#         , millisecondsUntilStandupEnds

#     set_url: (data)->
#       # TODO: re-implement to work with new system
#       # paneData = {}
#       # paneData["panes.#{data.pane}"] = data.url
#       # ls.set paneData
#       # $("##{data.pane}").attr 'src', data.url

#     set_callout: (data)->
#       callout data

#     close_callout: ->
#       callout.close()

#     end_standup: ->
#       @play_sound 'http://soundfxnow.com/soundfx/FamilyFeud-Buzzer3.mp3'
#       paneManager.standupPane().resetPosition()

#     play_sound: (data)->
#       $('#radio').attr(src: data)[0].play()

#     pavlov: ->
#       @play_sound 'http://rpg.hamsterrepublic.com/wiki-images/1/12/Ping-da-ding-ding-ding.ogg'

#   for own event, handler of eventHandlers
#     channel.bind event, handler
#     window[event] = handler
