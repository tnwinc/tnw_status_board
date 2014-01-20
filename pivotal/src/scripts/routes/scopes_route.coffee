App.ScopesRoute = App.Route.extend

  model: -> []

  setupController: (controller, model)->
    controller.set 'model', model

    _.each @controllerFor('project').get('scopes'), (scope)->
      if scope.get 'selected'
        controller.send 'addScope', scope

  deactivate: ->
    applicationController = @controllerFor 'application'
    applicationController.send 'hideBanner'
    applicationController.off 'settingsUpdated'
