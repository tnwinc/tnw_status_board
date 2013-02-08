define ["env/window"], (win) ->

    calloutActive = false
    timeout = undefined

    ContentGenerators =
        image:
            pattern: /^(.*\.(?:png|jpg|jpeg|bmp|gif))$/i
            generator: (imgSrc) ->
                img = ($ '<img src="'+imgSrc+'" style="max-height:100%; max-width:100%" />')
                img.bind 'load', ->
                    largerDimension = if ($ this).height() > ($ this).width() then "height" else "width"
                    ($ this).css largerDimension, "100%"
                pavlov()
                this img

        youtube:
            pattern: [ /youtu\.?be.*?[\/=]([\w\-]{11})/, /^([\w\-]{11})$/]
            generator: (url, videoId) ->
                win.playVideo = () ->
                    player = new YT.Player 'youtube-player',
                        height: '100%'
                        width: '100%'
                        videoId: videoId
                        events:
                            onReady: (ev) ->
                                ev.target.playVideo()
                            onStateChange: (ev) ->
                              player.setPlaybackQuality 'medium'
                              hideCallout() if ev.data == 0

                    return player
                this '<div id="youtube-player" /><script type="text/javascript"> window.playVideo(); delete window["playVideo"]; </script>'

        joinme:
          pattern: [/^(.*join\.me.*)$/, /\d{3}-\d{3}\d{3}/]
          timeout: 0
          generator: (url)->
            url = 'https://join.me/'+url if (url.indexOf '://') == -1
            this '<iframe src="'+url+'" style="height:100%; width:100%" scrolling="no" frameborder="0" />'

        url:
            pattern: /^(((http|ftp|https):\/\/)?[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)$/i
            generator: (url) ->
                url = 'http://'+url if (url.indexOf '://') == -1
                this '<iframe src="'+url+'" style="height:100%; width:100%" scrolling="no" frameborder="0" />'

        text:
            pattern: /^(.*)$/
            generator: (content) ->
                pavlov()
                this '<div class="valign">'+content+'</div><div class="vshim" />'

    showCallout = (data) ->
        clearTimeout timeout
        calloutActive = true
        callout = ($ '#callout')
        contentHandler = undefined
        if data.type
            def = ContentGenerators[data.type]
            if def.pattern instanceof Array
                for pattern in def.pattern
                    if match = pattern.test(data.content)
                        contentHandler =
                            pattern: pattern
                            generator: def.generator
                            timeout: def.timeout
                        break
            else
                if match = def.pattern.test(data.content)
                    contentHandler = def
            throw Error("Could not find a suitable regex match for the specified content type '" + data.type + "'") unless contentHandler
        else
            for own type, def of ContentGenerators
                if def.pattern instanceof Array
                    for pattern in def.pattern
                        if match = pattern.test(data.content)
                            contentHandler =
                                pattern: pattern
                                generator: def.generator
                                timeout: def.timeout
                            break
                    break if contentHandler
                else
                    if match = def.pattern.test(data.content)
                        contentHandler = def
                        break
            throw Error("No content handler was found to match requested content") unless contentHandler
        contentHandler.generator.apply (content) ->
            callout.html(content)
        , contentHandler.pattern.exec(data.content)

        timeout_val = (contentHandler.timeout ? data.timeout) or 0
        console.log "keeping callout open for #{timeout_val} seconds"
        if timeout_val
          timeout = setTimeout hideCallout, timeout_val * 1000

    hideCallout = (onComplete) ->
        clearTimeout timeout
        callout = ($ '#callout')
        callout.empty()
        calloutActive = false
        onComplete() if onComplete

    callout = (data) ->
        return (hideCallout -> showCallout data) if calloutActive
        showCallout data

    callout.close = ->
        hideCallout()

    return callout
