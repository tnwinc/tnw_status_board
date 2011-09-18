define [], () ->

    calloutActive = false
    timeout = undefined

    ContentGenerators =
        '^(.*\.(?:png|jpg|jpeg|bmp|gif))$': (imgSrc) ->
            img = ($ '<img src="'+imgSrc+'" style="max-height:100%; max-width:100%" />')
            img.bind 'load', ->
                largerDimension = if ($ this).height() > ($ this).width() then "height" else "width"
                ($ this).css largerDimension, "100%"
            this img

        '^(.*)$': (content) ->
            this '<div class="valign">'+content+'</div><div class="vshim" />'

    showCallout = (data) ->
        clearTimeout timeout
        calloutActive = true
        callout = ($ '#callout')
            .unbind('webkitTransitionEnd')
        timeout = setTimeout hideCallout, data.timeout * 1000 if data.timeout
        for own pattern, generator of ContentGenerators
            if match = new RegExp(pattern,'igm').exec(data.content)
                generator.apply (content) ->
                    callout.html(content)
                           .css {'-webkit-transform': 'scale(1)'}
                , match
                break

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

