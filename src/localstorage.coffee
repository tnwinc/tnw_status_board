define ['lib/underscore'], (_)->

  class LS

    constructor: (@namespace)->
      if @namespace
        @data = JSON.parse(localStorage[@namespace] || '{}')

    set: (settings)->
      if @namespace
        for own key, value of settings
          @data[key] = value
          @_save()
      else
        for own key, value of settings
          localStorage[key] = JSON.stringify value

    get: (key)->
      if @namespace
        @data[key]
      else
        JSON.parse(localStorage[key] || 'null')

    remove: (key)->
      if @namespace
        delete @data[key]
        @_save()
      else
        localStorage.removeItem key

    hasData: ->
      not _.isEmpty @data

    _save: ->
      localStorage[@namespace] = JSON.stringify @data
