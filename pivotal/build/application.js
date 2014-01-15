(function() {
  var BASE_URL, Pivotal;

  BASE_URL = 'https://www.pivotaltracker.com/services/v5/';

  Pivotal = Ember.Object.extend({
    init: function() {
      var token;
      token = localStorage.apiToken;
      if (token) {
        return this.set('token', JSON.parse(token));
      }
    },
    isAuthenticated: function() {
      return this.get('token') != null;
    },
    setToken: function(token) {
      localStorage.apiToken = JSON.stringify(token);
      return this.set('token', token);
    },
    getProjects: function() {
      return this.queryPivotal({
        url: 'projects'
      });
    },
    getProject: function(id) {
      return this.queryPivotal({
        url: "projects/" + id
      });
    },
    queryPivotal: function(config) {
      return $.ajax({
        type: 'GET',
        url: "" + BASE_URL + config.url,
        headers: {
          'X-TrackerToken': this.get('token')
        }
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
        if (attemptedTransition && attemptedTransition.targetName !== 'login') {
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


}).call(this);

(function() {
  App.Route = Ember.Route.extend({
    activate: function() {
      var cssClass;
      cssClass = this.cssClass();
      if (cssClass !== 'application') {
        return Ember.$('body').addClass(cssClass);
      }
    },
    deactivate: function() {
      return Ember.$('body').removeClass(this.cssClass());
    },
    cssClass: function() {
      return this.routeName.replace(/\./g, '-').dasherize();
    },
    beforeModel: function(transition) {
      if (!App.pivotal.isAuthenticated()) {
        this.controllerFor('login').set('attemptedTransition', transition);
        return this.transitionTo('login');
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
  App.ProjectRoute = Ember.Route.extend({
    model: function(params) {
      return App.pivotal.getProject(params.project_id).then(function(project) {
        return _.pick(project, 'id', 'name');
      });
    }
  });

}).call(this);

(function() {
  App.ProjectsRoute = App.Route.extend({
    model: function() {
      return App.pivotal.getProjects().then(function(projects) {
        return _.map(projects, function(project) {
          return _.pick(project, 'id', 'name');
        });
      });
    }
  });

}).call(this);

(function() {
  App.Router.map(function() {
    this.route('login');
    return this.resource('projects', function() {
      return this.resource('project', {
        path: ':project_id'
      });
    });
  });

}).call(this);
