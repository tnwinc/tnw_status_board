App.Router.map ->
  @resource 'panes', ->
    for event, args of App.Pusher.events when _.isArray args
      args = args.slice()
      args.unshift(event)
      @route event, path: args.join('/:')
