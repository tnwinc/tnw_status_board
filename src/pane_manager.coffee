define ['localstorage', 'lib/underscore', 'lib/handlebars', 'hbs_helpers/pane_style'], (LS, _, Handlebars)->

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

      migratePane = (key, properties)=>
        if url = oldLs.get key
          properties = _.map properties, (property)->
            new Property property...
          id = randomId()
          @panes[id] = new Pane(id, url, properties)
          oldLs.remove key

      panesToMigrate =
        'panes.topLeft': [
          ['left', 0, 'px']
          ['top', 0, 'px']
          ['width', 25, '%']
          ['height', 450, 'px']
        ]
        'panes.topMiddle': [
          ['left', 25, '%']
          ['top', 0, 'px']
          ['width', 25, '%']
          ['height', 450, 'px']
        ]
        'panes.topRight': [
          ['right', 0, 'px']
          ['top', 0, 'px']
          ['width', 50, '%']
          ['height', 450, 'px']
        ]
        'panes.bottom': [
          ['top', 450, 'px']
          ['right', 0, 'px']
          ['bottom', 0, 'px']
          ['left', 0, 'px']
        ]

      for key, properties of panesToMigrate
        migratePane key, properties

      @ls.set panes: @panes

    renderPanes: ->
      template = Handlebars.compile $('#view-panes-template').html()
      $(template(panes: @panes)).appendTo '#view-panes'
