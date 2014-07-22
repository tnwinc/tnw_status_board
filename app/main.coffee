App = require './app'
events = require './events/events'
_ = require 'lodash'

require './services/services'
require './components/components'
require './events/pusher'

require './index/route'
require './application/route'
require './panes/route'

App.Router.map ->
  @resource 'panes', ->
    for event, args of events when _.isArray args
      args = args.slice()
      args.unshift(event)
      @route event, path: args.join('/:')
