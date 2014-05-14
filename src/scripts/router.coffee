App.Router.map ->
  @resource 'panes', ->
    @resource 'editpane', path: 'edit/:id'
