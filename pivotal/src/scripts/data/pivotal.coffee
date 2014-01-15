BASE_URL = 'https://www.pivotaltracker.com/services/v5/'
token = null

queryPivotal = (config)->
  $.ajax
    type: 'GET'
    url: "#{BASE_URL}#{config.url}"
    headers:
      'X-TrackerToken': token

Pivotal = Ember.Object.extend

  isAuthenticated: ->
    token?

  setToken: (aToken)->
    token = aToken

  getProjects: ->
    queryPivotal url: 'projects'

App.pivotal = Pivotal.create()
