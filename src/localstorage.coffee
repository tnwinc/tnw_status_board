define ['lib/underscore'], (_)->

  class LS

    constructor: (@namespace)->
      if @namespace
        @data = JSON.parse(localStorage[@namespace] || '{}')

    set: (settings)->
      if @namespace
        for own key, value of settings
          @data[key] = value
        localStorage[@namespace] = JSON.stringify @data
      else
        for own key, value of settings
          localStorage[key] = JSON.stringify value

    get: (key)->
      if @namespace
        @data[key]
      else
        JSON.parse(localStorage[key] || 'null')

    hasData: ->
      not _.isEmpty @data
