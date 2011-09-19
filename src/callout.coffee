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
                    new YT.Player 'youtube-player',
                        height: '100%'
                        width: '100%'
                        videoId: videoId
                        events:
                            onReady: (ev) ->
                                ev.target.playVideo()
                            onStateChange: (ev) ->
                                hideCallout() if ev.data == 0
                this '<div id="youtube-player" /><script type="text/javascript"> window.playVideo(); delete window["playVideo"]; </script>'

        url:
            pattern: /^(((http|ftp|https):\/\/)?[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)$/i
            generator: (url) ->
                url = 'http://'+url if (url.indexOf 'http://') == -1
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
            .unbind('webkitTransitionEnd')
        timeout = setTimeout hideCallout, data.timeout * 1000 if data.timeout
        contentHandler = undefined
        if data.type
            def = ContentGenerators[data.type]
            if def.pattern instanceof Array
                for pattern in def.pattern
                    if match = pattern.test(data.content)
                        contentHandler =
                            pattern: pattern
                            generator: def.generator
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
                            break
                    break if contentHandler
                else
                    if match = def.pattern.test(data.content)
                        contentHandler = def
                        break
            throw Error("No content handler was found to match requested content") unless contentHandler
        contentHandler.generator.apply (content) ->
            callout.html(content)
                   .css {'-webkit-transform': 'scale(1)'}
        , contentHandler.pattern.exec(data.content)

    hideCallout = (onComplete) ->
        clearTimeout timeout
        callout = ($ '#callout')
            .unbind('webkitTransitionEnd')
            .css({'-webkit-transform': 'scale(0)'})
            .bind 'webkitTransitionEnd', ->
                callout.unbind('webkitTransitionEnd').empty()
                calloutActive = false
                onComplete() if onComplete

    callout = (data) ->
        return (hideCallout -> showCallout data) if calloutActive
        showCallout data

    callout.close = ->
        hideCallout()

    return callout