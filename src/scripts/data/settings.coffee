Settings = Ember.Object.extend

  init: ->
    data = localStorage[App.NAMESPACE]
    @cache = JSON.parse(data || '{}')

  getValue: (key, defaultValue)->
    unless @cache[key]?
      @cache[key] = defaultValue
    @cache[key]

  updateNumber: (key, value, defaultValue)->
    if _.isNaN Number(value)
      value = defaultValue
    @save key, value

  updateString: (key, value, defaultValue)->
    if not _.isString(value) or $.trim(value) is ''
      value = defaultValue
    @save key, value

  updateValue: (key, value)->
    @save key, value

  save: (key, value)->
    @cache[key] = value
    localStorage[App.NAMESPACE] = JSON.stringify @cache
    value

App.settings = Settings.create()
