define ['localstorage'], (LS)->
  NAMESPACE = 'frame_manager'

  class FrameManager

    constructor: ->
      @ls = new LS NAMESPACE
      @frames = @ls.get('frames') || []
