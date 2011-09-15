define ["env/localstorage", "env/window", "env/document"], (storage, win, doc) ->

  $ ->
    $("frame").each ->
      console.log("looking for: ", "panes."+$(this).attr('id') )
      if( url = storage.getItem("panes."+$(this).attr('id')))
        $(this).attr('src', url)

  unless key = storage.getItem("pusher.api-key")
    key = win.prompt("What is the pusher api key?")
    storage.setItem("pusher.api-key", key)

  Pusher.log = (message) ->
    win.console.log(message) if (win.console && win.console.log) 

  pusher = new Pusher(key)
  channel = pusher.subscribe 'test_channel'

  channel.bind 'reload_board', (data) ->
    win.location.reload()

  channel.bind 'start_standup', (data) ->
    framesets = doc.getElementsByTagName("frameset")
    oldSize = framesets[0].rows
    framesets[0].rows = "0,*"

    millisecondsUntilStandupEnds = 1000*60* (data || 16)
    setTimeout ->
      framesets[0].rows = oldSize
    , millisecondsUntilStandupEnds

  channel.bind 'set_url', (data) ->
    console.log("setting: ", "panes."+$(this).attr('id') )
    storage.setItem("panes."+data.pane, data.url)
    $("#"+data.pane).attr('src',data.url)

  channel.bind 'set_callout', (data) ->
    $("#topRight").attr('src',data)