define ->

  class LS

    constructor: (@namespace)->
      if @namespace
        @data = JSON.parse(localStorage[@namespace] || '{}')

    set: (key, value)->
      if @namespace
        @data[key] = value
        localStorage[@namespace] = JSON.stringify @data
      else
        localStorage[key] = JSON.stringify value

    get: (key)->
      if @namespace
        @data[key]
      else
        JSON.parse(localStorage[key] || 'null')
