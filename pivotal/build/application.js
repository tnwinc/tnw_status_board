(function() {
  var BASE_URL, Pivotal, queryPivotal, token;

  BASE_URL = 'https://www.pivotaltracker.com/services/v5/';

  token = null;

  queryPivotal = function(config) {
    return $.ajax({
      type: 'GET',
      url: "" + BASE_URL + config.url,
      headers: {
        'X-TrackerToken': token
      }
    });
  };

  Pivotal = Ember.Object.extend({
    isAuthenticated: function() {
      return token != null;
    },
    setToken: function(aToken) {
      return token = aToken;
    },
    getProjects: function() {
      return queryPivotal({
        url: 'projects'
      });
    }
  });

  App.pivotal = Pivotal.create();

}).call(this);

(function() {


}).call(this);

(function() {
  App.LoginController = Ember.Controller.extend({
    reset: function() {
      return this.set('token', '');
    },
    actions: {
      submit: function() {
        var attemptedTransition;
        App.pivotal.setToken(this.get('token'));
        attemptedTransition = this.get('attemptedTransition');
        if (attemptedTransition) {
          attemptedTransition.retry();
          return this.set('attemptedTransition', null);
        } else {
          return this.transitionToRoute('projects');
        }
      }
    }
  });

}).call(this);

(function() {
  App.Route = Ember.Route.extend({
    redirectToLogin: function(transition) {
      this.controllerFor('login').set('attemptedTransition', transition);
      return this.transitionTo('login');
    },
    beforeModel: function(transition) {
      if (!App.pivotal.isAuthenticated()) {
        return this.redirectToLogin(transition);
      }
    },
    actions: {
      error: function(reason, transition) {
        return this.redirectToLogin(transition);
      }
    }
  });

}).call(this);

(function() {
  App.IndexRoute = App.Route.extend({
    redirect: function() {
      return this.transitionTo('projects');
    }
  });

}).call(this);

(function() {
  App.LoginRoute = App.Route.extend({
    setupController: function(controller) {
      return controller.reset();
    }
  });

}).call(this);

(function() {
  App.ProjectsRoute = App.Route.extend({
    model: function() {
      return App.pivotal.getProjects();
    }
  });

}).call(this);

(function() {
  App.Router.map(function() {
    this.route('login');
    return this.resource('projects');
  });

}).call(this);
