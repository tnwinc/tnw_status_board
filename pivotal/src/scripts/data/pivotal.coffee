BASE_URL = 'https://www.pivotaltracker.com/services/v5/'
PROJECT_UPDATES_POLL_INTERVAL = 3 * 1000

Pivotal = Ember.Object.extend Ember.Evented,

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
        _.pick project, 'id', 'name', 'version'

  getProject: (id)->
    @queryPivotal("projects/#{id}").then (project)->
      _.pick project, 'id', 'name', 'version'

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

  listenForProjectUpdates: (project)->
    if @get('projectData.id') isnt project.id
      clearInterval @get('projectData.interval')

    queryForUpdates = =>
      currentVersion = @get 'projectData.version'
      @queryPivotal("project_stale_commands/#{project.id}/#{currentVersion}").then (info) =>
        if currentVersion isnt info.project_version
          @set 'projectData.version', info.project_version
          @trigger 'projectUpdated'

    @set 'projectData',
      id: project.id
      version: project.version
      interval: setInterval(queryForUpdates,  PROJECT_UPDATES_POLL_INTERVAL)

  queryPivotal: (url, data)->
    $.ajax
      type: 'GET'
      url: "#{BASE_URL}#{url}"
      data: data
      headers:
        'X-TrackerToken': @get 'token'

App.pivotal = Pivotal.create()
