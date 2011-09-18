define ["env/localstorage", "env/window", "env/document", "callout"], (storage, win, doc, callout) ->

  $ ->
    $("iframe").each ->
      if( url = storage.getItem("panes."+$(this).attr('id')))
        $(this).attr('src', url)

  unless key = storage.getItem("pusher.api-key")
    key = win.prompt("What is the pusher api key?")
    storage.setItem("pusher.api-key", key)

  Pusher.log = (message) ->
    win.console.log(message) if (win.console && win.console.log)

  pusher = new Pusher(key)
  channel = pusher.subscribe 'test_channel'

  EventHandlers =
    reload_board: (data) ->
      $(body).fadeOut ->
        win.location.reload()

    start_standup:(data) ->
      container = $('#bottomContainer')
      oldTop = container.css('top')
      container.animate({top: 0})
      if( data )
        millisecondsUntilStandupEnds = 1000*60*data
        setTimeout ->
          container.animate({top: oldTop})
        , millisecondsUntilStandupEnds

    set_url:(data) ->
      storage.setItem("panes."+data.pane, data.url)
      $("#"+data.pane).attr('src',data.url)

    set_callout:(data) ->
      callout(data)

    close_callout: ->
      callout.close()
      
    end_standup: ->
      $('#bottomContainer').animate({top:270})

  for own event, handler of EventHandlers
    channel.bind event, handler
    window[event] = handler