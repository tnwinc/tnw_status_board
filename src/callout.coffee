define [], () ->

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
                this img

        url:
            pattern: /^(((http|ftp|https):\/\/)?[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)$/i
            generator: (url) ->
                url = 'http://'+url if (url.indexOf 'http://') == -1
                iframe = ($ '<iframe src="'+url+'" style="height:100%; width:100%" scrolling="no" />')
                this iframe

        text:
            pattern: /^(.*)$/
            generator: (content) ->
                this '<div class="valign">'+content+'</div><div class="vshim" />'

    showCallout = (data) ->
        clearTimeout timeout
        calloutActive = true
        callout = ($ '#callout')
            .unbind('webkitTransitionEnd')
        timeout = setTimeout hideCallout, data.timeout * 1000 if data.timeout
        contentHandler = undefined
        if data.type
           contentHandler = ContentGenerators[data.type]
        else
            for own type, def of ContentGenerators
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

    (data) ->
        return (hideCallout -> showCallout data) if calloutActive
        showCallout data

