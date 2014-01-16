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
      return this.queryPivotal('projects').then(function(projects) {
        return _.map(projects, function(project) {
          return _.pick(project, 'id', 'name');
        });
      });
    },
    getProject: function(id) {
      return this.queryPivotal("projects/" + id).then(function(project) {
        return _.pick(project, 'id', 'name');
      });
    },
    getIterations: function(projectId, scope) {
      return this.queryPivotal("projects/" + projectId + "/iterations", {
        scope: scope
      }).then(function(iterations) {
        return _.map(iterations, function(iteration) {
          return {
            start: new Date(iteration.start),
            finish: new Date(iteration.finish),
            stories: _.map(iteration.stories, function(story) {
              var curatedStory;
              curatedStory = _.pick(story, 'id', 'name', 'current_state', 'story_type', 'estimate');
              curatedStory.labels = _.map(story.labels, function(label) {
                return _.pick(label, 'id', 'name');
              });
              return curatedStory;
            })
          };
        });
      });
    },
    queryPivotal: function(url, data) {
      return $.ajax({
        type: 'GET',
        url: "" + BASE_URL + url,
        data: data,
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
  App.ScopesController = Ember.ArrayController.extend({
    actions: {
      toggleExpansion: function(iteration) {
        iteration.toggleProperty('expanded');
      },
      expandAll: function(scope) {
        return _.each(scope.get('iterations'), function(iteration) {
          return iteration.set('expanded', true);
        });
      },
      collapseAll: function(scope) {
        return _.each(scope.get('iterations'), function(iteration) {
          return iteration.set('expanded', false);
        });
      }
    }
  });

}).call(this);

(function() {
  App.ItemPickerComponent = Ember.Component.extend({
    expanded: false,
    didInsertElement: function() {
      var _this = this;
      return Ember.$('body').on('click.expansion', function() {
        return _this.set('expanded', false);
      });
    },
    willDestroy: function() {
      return Ember.$('body').off('click.expansion');
    },
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
      toggleExpansion: function() {
        this.toggleProperty('expanded');
      },
      selectItem: function(item) {
        this.set('expanded', false);
        if (!item.get('current')) {
          return this.sendAction('onSelect', item);
        }
      }
    }
  });

}).call(this);

(function() {
  Ember.Handlebars.helper('date', function(date) {
    return moment(date).format('MMM D');
  });

}).call(this);

(function() {
  Ember.Handlebars.helper('expando_icon', function(expanded) {
    var className;
    className = expanded ? "fa-caret-up" : "fa-caret-down";
    return new Ember.Handlebars.SafeString("<i class='fa " + className + "'></i>");
  });

}).call(this);

(function() {
  Ember.Handlebars.helper('story_icon', function(storyType) {
    var className;
    className = (function() {
      switch (storyType) {
        case 'feature':
          return 'fa-star';
        case 'chore':
          return 'fa-cog';
        case 'bug':
          return 'fa-bug';
        case 'release':
          return 'fa-flag-checkered';
      }
    })();
    return new Ember.Handlebars.SafeString("<i class='fa " + className + "'></i>");
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
      var _this = this;
      this._super();
      controller.set('model', model);
      return App.pivotal.getProjects().then(function(projects) {
        controller.set('projects', _.map(projects, function(project) {
          return Ember.Object.create({
            id: project.id,
            label: project.name
          });
        }));
        return _this.transitionTo('scopes');
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
  App.ScopesRoute = App.Route.extend({
    model: function() {
      var projectId;
      projectId = this.modelFor('project').id;
      return App.pivotal.getIterations(projectId, 'current_backlog').then(function(iterations) {
        var scope;
        scope = Ember.Object.create({
          id: 'current_backlog',
          iterations: _.map(iterations, function(iteration) {
            return Ember.Object.create(iteration);
          })
        });
        return [scope];
      });
    },
    setupController: function(controller, model) {
      controller.set('model', model);
      return _.each(model, function(scope) {
        return _.each(scope.get('iterations'), function(iteration) {
          iteration.set('expanded', true);
          return iteration.set('hasStories', iteration.get('stories.length'));
        });
      });
    }
  });

}).call(this);

(function() {
  App.Router.map(function() {
    this.route('login');
    this.resource('projects');
    return this.resource('project', {
      path: 'projects/:project_id'
    }, function() {
      return this.resource('scopes');
    });
  });

}).call(this);
