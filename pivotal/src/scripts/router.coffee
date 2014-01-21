App.Router.map ->
  @route 'login'
  @resource 'projects'
  @resource 'project', path: 'projects/:project_id', ->
    @resource 'iterations'
