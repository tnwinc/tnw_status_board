define ['localstorage', 'lib/handlebars', 'hbs_helpers/iframe_style'], (LS, Handlebars)->
  NAMESPACE = 'frame_manager'

  class Property

    constructor: (@name, @value, @units)->

    toString: ->
      if @value is 0 then @value.toString() else "#{@value}#{@units}"

  class Frame

    constructor: (@url = '', @properties)->

  class FrameManager

    constructor: ->
      @ls = new LS NAMESPACE

      @frames = @ls.get('frames') || []
      @firstRun() unless @ls.hasData()
      @renderFrames()

    firstRun: ->
      oldLs = new LS()

      if topLeftUrl = oldLs.get 'panes.topLeft'
        properties = [
          new Property 'left', 0, 'px'
          new Property 'top', 0, 'px'
          new Property 'width', 25, '%'
          new Property 'height', 450, 'px'
        ]
        @frames.push new Frame(topLeftUrl, properties)

      if topMiddleUrl = oldLs.get 'panes.topMiddle'
        properties = [
          new Property 'left', 25, '%'
          new Property 'top', 0, 'px'
          new Property 'width', 25, '%'
          new Property 'height', 450, 'px'
        ]
        @frames.push new Frame(topMiddleUrl, properties)

      if topRightUrl = oldLs.get 'panes.topRight'
        properties = [
          new Property 'right', 0, 'px'
          new Property 'top', 0, 'px'
          new Property 'width', 50, '%'
          new Property 'height', 450, 'px'
        ]
        @frames.push new Frame(topRightUrl, properties)

      if bottomUrl = oldLs.get 'panes.bottom'
        properties = [
          new Property 'top', 450, 'px'
          new Property 'right', 0, 'px'
          new Property 'bottom', 0, 'px'
          new Property 'left', 0, 'px'
        ]
        @frames.push new Frame(bottomUrl, properties)

    renderFrames: ->
      template = Handlebars.compile $('#view-frames-template').html()
      $(template(frames: @frames)).appendTo '#view-frames'
