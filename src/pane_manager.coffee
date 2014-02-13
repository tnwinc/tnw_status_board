define ['localstorage', 'lib/handlebars', 'hbs_helpers/pane_style'], (LS, Handlebars)->

  NAMESPACE = 'pane_manager'

  class Property

    constructor: (@name, @value, @units)->

    toString: ->
      if @value is 0 then @value.toString() else "#{@value}#{@units}"

  class Pane

    constructor: (@url = '', @properties)->

  class PaneManager

    constructor: ->
      @ls = new LS NAMESPACE

      @panes = @ls.get('panes') || []
      @firstRun() unless @ls.hasData()
      @renderPanes()

    firstRun: ->
      oldLs = new LS()

      if topLeftUrl = oldLs.get 'panes.topLeft'
        properties = [
          new Property 'left', 0, 'px'
          new Property 'top', 0, 'px'
          new Property 'width', 25, '%'
          new Property 'height', 450, 'px'
        ]
        @panes.push new Pane(topLeftUrl, properties)

      if topMiddleUrl = oldLs.get 'panes.topMiddle'
        properties = [
          new Property 'left', 25, '%'
          new Property 'top', 0, 'px'
          new Property 'width', 25, '%'
          new Property 'height', 450, 'px'
        ]
        @panes.push new Pane(topMiddleUrl, properties)

      if topRightUrl = oldLs.get 'panes.topRight'
        properties = [
          new Property 'right', 0, 'px'
          new Property 'top', 0, 'px'
          new Property 'width', 50, '%'
          new Property 'height', 450, 'px'
        ]
        @panes.push new Pane(topRightUrl, properties)

      if bottomUrl = oldLs.get 'panes.bottom'
        properties = [
          new Property 'top', 450, 'px'
          new Property 'right', 0, 'px'
          new Property 'bottom', 0, 'px'
          new Property 'left', 0, 'px'
        ]
        @panes.push new Pane(bottomUrl, properties)

    renderPanes: ->
      template = Handlebars.compile $('#view-panes-template').html()
      $(template(panes: @panes)).appendTo '#view-panes'
