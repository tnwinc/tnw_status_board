Settings = Ember.Object.extend

  getValue: (key, defaultValue)->
    value = localStorage[key]
    unless value
      localStorage[key] = value = JSON.stringify defaultValue
    JSON.parse value

  updateNumber: (key, value, defaultValue)->
    value = Number value
    if _.isNaN value
      value = defaultValue
    localStorage[key] = JSON.stringify value
    value

  updateString: (key, value, defaultValue)->
    value = value.toString()
    if $.trim(value) is ''
      value = defaultValue
    localStorage[key] = JSON.stringify value
    value

App.settings = Settings.create()
