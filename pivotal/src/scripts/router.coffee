App.Router.map ->
  @route 'login'
  @resource 'projects', ->
    @resource 'project', path: ':project_id'
