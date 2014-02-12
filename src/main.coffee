define ["env/localstorage", "env/window", "env/document", "callout", "frame_manager"], (LS, win, doc, callout, FrameManager) ->

  ls = new LS()
  frameManager = new FrameManager()

  unless key = ls.get 'pusher.api-key'
    key = win.prompt("What is the pusher api key?")
    ls.set 'pusher.api-key', key

  Pusher.log = (message) -> console.log message

  pusher = new Pusher(key)
  channel = pusher.subscribe 'test_channel'

  EventHandlers =
    reload_board: (data) ->
      $('body').fadeOut ->
        win.location.reload()

    start_standup: (minutes) ->
      console.log "Starting standup for #{minutes} minutes"
      play_sound "http://soundfxnow.com/soundfx/MilitaryTrumpetTune1.mp3"
      container = $('#bottomContainer')
      oldTop = container.css('top')
      container.animate({top: 0})
      if( minutes )
        for reminderInterval in [ 0.75, 0.9, 0.95 ]
          console.log "Setting reminder interval for #{reminderInterval * minutes} minutes (#{reminderInterval * minutes * 60} seconds)"
          do (reminderInterval) ->
            milliseconds = 1000*60*reminderInterval*minutes
            setTimeout ->
              play_sound "http://soundfxnow.com/soundfx/GameshowBellDing2.mp3"
            , milliseconds

        millisecondsUntilStandupEnds = 1000*60*minutes
        setTimeout ->
          end_standup()
        , millisecondsUntilStandupEnds

    set_url: (data) ->
      ls.set "panes.#{data.pane}", data.url
      $("#"+data.pane).attr 'src', data.url

    set_callout: (data) ->
      callout(data)

    close_callout: ->
      callout.close()

    end_standup: ->
      play_sound "http://soundfxnow.com/soundfx/FamilyFeud-Buzzer3.mp3"
      $('#bottomContainer').animate {top:270}

    play_sound: (data) ->
      $('#radio').attr({src: data})[0].play()

    pavlov: ->
      play_sound('http://rpg.hamsterrepublic.com/wiki-images/1/12/Ping-da-ding-ding-ding.ogg')

  for own event, handler of EventHandlers
    channel.bind event, handler
    window[event] = handler
