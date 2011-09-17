define [], () ->

    calloutActive = false
    timeout = undefined

    showCallout = (data) ->
        clearTimeout timeout
        calloutActive = true
        callout = ($ '#callout')
            .unbind('webkitTransitionEnd')
            .html('<div class="valign">'+data.content+'</div><div class="vshim" />')
            .css {'-webkit-transform': 'scale(1)'}

        timeout = setTimeout hideCallout, data.timeout * 1000 if data.timeout

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

