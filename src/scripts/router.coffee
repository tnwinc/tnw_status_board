App.Router.map ->
  @resource 'panes', ->
    for event, args of App.pusherEvents when _.isArray args
      args = args.slice()
      args.unshift(event)
      @route event, path: args.join('/:')
