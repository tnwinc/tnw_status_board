BASE_URL = 'https://www.pivotaltracker.com/services/v5/'

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
            curatedStory = _.pick story, 'id', 'name', 'current_state', 'story_type', 'estimate'
            curatedStory.labels = _.pluck story.labels, 'name'
            curatedStory

  queryPivotal: (url, data)->
    $.ajax
      type: 'GET'
      url: "#{BASE_URL}#{url}"
      data: data
      headers:
        'X-TrackerToken': @get 'token'

App.pivotal = Pivotal.create()
