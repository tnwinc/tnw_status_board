BASE_URL = 'https://www.pivotaltracker.com/services/v5/'
PROJECT_UPDATES_POLL_INTERVAL = 3 * 1000

project_data = undefined

Pivotal = Ember.Object.extend

  init: ->
    token = localStorage.apiToken
    @set 'token', JSON.parse(token) if token

  isAuthenticated: ->
    @get('token')?

  setToken: (token)->
    localStorage.apiToken = JSON.stringify token
    @set 'token', token

  getProjects: ->
    @queryPivotal('projects').then (projects)->
      _.map projects, (project)->
        _.pick project, 'id', 'name'

  getProject: (id)->
    @queryPivotal("projects/#{id}").then (project)->
      _.pick project, 'id', 'name'

  getIterations: (projectId)->
    @queryPivotal("projects/#{projectId}/iterations", scope: 'current_backlog').then (iterations)->
      _.map iterations, (iteration)->
        Ember.Object.create
          start: new Date(iteration.start)
          finish: new Date(iteration.finish)
          expanded: true
          stories: _.map iteration.stories, (story)->
            curatedStory = _.pick story, 'id', 'name', 'current_state', 'story_type', 'estimate', 'accepted_at'
            curatedStory.labels = _.pluck story.labels, 'name'
            curatedStory

  listenForProjectUpdates: (projectId)->
    clearInterval project_data.interval if project_data? and project_data.projectId isnt projectId

    project_data = projectId: projectId, handlers: []

    @queryPivotal("projects/#{projectId}").then (project)=> 
      project_data.version = project.version
      project_data.interval = setInterval (=> 
        @queryPivotal("project_stale_commands/#{projectId}/#{project_data.version}").then (info) ->
          if project_data.version isnt info.project_version
            handler() for handler in project_data?.handlers or []
      ), PROJECT_UPDATES_POLL_INTERVAL

    return then: (fn)-> project_data.handlers.push fn



  queryPivotal: (url, data)->
    $.ajax
      type: 'GET'
      url: "#{BASE_URL}#{url}"
      data: data
      headers:
        'X-TrackerToken': @get 'token'

App.pivotal = Pivotal.create()
