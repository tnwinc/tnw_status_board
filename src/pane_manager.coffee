define ['localstorage', 'lib/handlebars', 'hbs_helpers/pane_style'], (LS, Handlebars)->

  NAMESPACE = 'pane_manager'

  randomId = ->
    Math.floor(Math.random() * 100000)

  class Property

    constructor: (@name, @value, @units)->

    toString: ->
      if @value is 0 then @value.toString() else "#{@value}#{@units}"

  class Pane

    constructor: (@id, @url = '', @properties)->

  class PaneManager

    constructor: ->
      @ls = new LS NAMESPACE

      panes = @ls.get('panes') || {}
      @panes = {}
      for id, pane of panes
        properties = _.map pane.properties, (property)->
          new Property(property.name, property.value, property.units)
        @panes[id] = new Pane(id, pane.url, properties)

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
        id = randomId()
        @panes[id] = new Pane(id, topLeftUrl, properties)

      if topMiddleUrl = oldLs.get 'panes.topMiddle'
        properties = [
          new Property 'left', 25, '%'
          new Property 'top', 0, 'px'
          new Property 'width', 25, '%'
          new Property 'height', 450, 'px'
        ]
        id = randomId()
        @panes[id] = new Pane(id, topMiddleUrl, properties)

      if topRightUrl = oldLs.get 'panes.topRight'
        properties = [
          new Property 'right', 0, 'px'
          new Property 'top', 0, 'px'
          new Property 'width', 50, '%'
          new Property 'height', 450, 'px'
        ]
        id = randomId()
        @panes[id] = new Pane(id, topRightUrl, properties)

      if bottomUrl = oldLs.get 'panes.bottom'
        properties = [
          new Property 'top', 450, 'px'
          new Property 'right', 0, 'px'
          new Property 'bottom', 0, 'px'
          new Property 'left', 0, 'px'
        ]
        id = randomId()
        @panes[id] = new Pane(id, bottomUrl, properties)

      @ls.set panes: @panes

    renderPanes: ->
      template = Handlebars.compile $('#view-panes-template').html()
      $(template(panes: @panes)).appendTo '#view-panes'
