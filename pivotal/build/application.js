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
      }).then(function(projects) {
        return _.map(projects, function(project) {
          return _.pick(project, 'id', 'name');
        });
      });
    },
    getProject: function(id) {
      return this.queryPivotal({
        url: "projects/" + id
      }).then(function(project) {
        return _.pick(project, 'id', 'name');
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
  App.ProjectController = Ember.ObjectController.extend({
    actions: {
      didSelectProject: function(project) {
        return this.transitionToRoute('project', project.get('id'));
      }
    }
  });

}).call(this);

(function() {
  App.ItemPickerComponent = Ember.Component.extend({
    curatedItems: (function() {
      var withCurrent,
        _this = this;
      withCurrent = _.map(this.get('items'), function(item) {
        return item.set('current', _this.get('currentItemId') === item.get('id'));
      });
      return withCurrent.sort(function(a, b) {
        return b.get('current') - a.get('current');
      });
    }).property('items', 'currentItemId'),
    actions: {
      selectItem: function(item) {
        if (!item.get('current')) {
          return this.sendAction('onSelect', item);
        }
      }
    }
  });

}).call(this);

(function() {
  App.Route = Ember.Route.extend({
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
  App.ProjectRoute = App.Route.extend({
    model: function(params) {
      return App.pivotal.getProject(params.project_id);
    },
    setupController: function(controller, model) {
      this._super();
      controller.set('model', model);
      return App.pivotal.getProjects().then(function(projects) {
        return controller.set('projects', _.map(projects, function(project) {
          return Ember.Object.create({
            id: project.id,
            label: project.name
          });
        }));
      });
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
    this.resource('projects');
    return this.resource('project', {
      path: 'projects/:project_id'
    });
  });

}).call(this);
