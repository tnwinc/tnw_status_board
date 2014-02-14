define ['localstorage', 'lib/underscore', 'lib/handlebars', 'hbs_helpers/pane_style'], (LS, _, Handlebars)->

  NAMESPACE = 'pane_manager'

  $body = $ document.body

  randomId = ->
    Math.floor(Math.random() * 100000)

  class Property

    constructor: (@name, @value, @units)->

    toString: ->
      if @value is 0 then @value.toString() else "#{@value}#{@units}"

  class Pane

    constructor: (@id, @url = '', @properties)->

    makeFullScreen: ->
      $el = $("#p-#{@id}")
      $el.animate
        top: 0
        right: 0
        bottom: 0
        left: 0
        width: 'auto'
        height: 'auto'
      $el.addClass 'in-standup'

    resetPosition: ->
      $el = $("#p-#{@id}")
      $el.style = ''
      css = {}
      for property in @properties
        css[property.name] = property.toString()
      $el.css css
      $el.removeClass 'in-standup'

  class PaneManager

    constructor: ->
      @ls = new LS NAMESPACE

      panes = @ls.get('panes') || {}
      @panes = {}
      for id, pane of panes
        properties = _.map pane.properties, (property)->
          new Property(property.name, property.value, property.units)
        @panes[id] = new Pane(pane.id, pane.url, properties)

      @firstRun() unless @ls.hasData()
      @renderPanes 'view'

      @bindEvents()

    bindEvents: ->
      $body.on 'click', '#edit-panes', (e)=>
        e.preventDefault()
        @editPanes()

    editPanes: ->
      @renderPanes 'edit'

    standupPane: ->
      id = @ls.get 'standupPaneId'
      _.find @panes, (pane)-> pane.id is id

    firstRun: ->
      oldLs = new LS()

      migratePane = (pane)=>
        if url = oldLs.get pane.oldKey
          properties = _.map pane.properties, (property)->
            new Property property...
          id = randomId()
          @panes[id] = new Pane(id, url, properties)
          if pane.standup
            @ls.set standupPaneId: id
          oldLs.remove pane.oldKey

      panesToMigrate = [
        oldKey: 'panes.topLeft'
        properties: [
          ['left', 0, 'px']
          ['top', 0, 'px']
          ['width', 25, '%']
          ['height', 450, 'px']
        ]
      ,
        oldKey: 'panes.topMiddle'
        properties: [
          ['left', 25, '%']
          ['top', 0, 'px']
          ['width', 25, '%']
          ['height', 450, 'px']
        ]
      ,
        oldKey: 'panes.topRight'
        properties: [
          ['right', 0, 'px']
          ['top', 0, 'px']
          ['width', 50, '%']
          ['height', 450, 'px']
        ]
      ,
        oldKey: 'panes.bottom'
        standup: true
        properties: [
          ['top', 450, 'px']
          ['right', 0, 'px']
          ['bottom', 0, 'px']
          ['left', 0, 'px']
        ]
      ]

      migratePane pane for pane in panesToMigrate

      @ls.set panes: @panes

    renderPanes: (type)->
      template = Handlebars.compile $("##{type}-panes-template").html()
      $(template(panes: @panes)).appendTo "##{type}-panes-container"
