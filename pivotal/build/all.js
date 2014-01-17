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
  var $body;

  $body = Ember.$('body');

  App.ApplicationController = Ember.Controller.extend(Ember.Evented, {
    init: function() {
      var baseFontSize, inProgressMax;
      this._super();
      this.set('fullscreen', true);
      $body.addClass('fullscreen');
      baseFontSize = localStorage.baseFontSize;
      if (!baseFontSize) {
        localStorage.baseFontSize = baseFontSize = JSON.stringify(16);
      }
      this.set('baseFontSize', JSON.parse(baseFontSize));
      $body.css('font-size', "" + baseFontSize + "px");
      inProgressMax = localStorage.inProgressMax;
      if (!inProgressMax) {
        localStorage.inProgressMax = inProgressMax = JSON.stringify(5);
      }
      return this.set('inProgressMax', JSON.parse(inProgressMax));
    },
    handleFullscreen: (function() {
      var action;
      action = this.get('fullscreen') ? 'addClass' : 'removeClass';
      return Ember.$('body')[action]('fullscreen');
    }).observes('fullscreen'),
    actions: {
      showBanner: function(message, type) {
        return this.set('banner', {
          message: message,
          type: type
        });
      },
      hideBanner: function() {
        return this.set('banner', null);
      },
      toggleFullscreen: function() {
        this.toggleProperty('fullscreen');
      },
      openSettings: function() {
        return this.set('settingsOpen', true);
      },
      saveSettings: function() {
        var baseFontSize, inProgressMax;
        inProgressMax = Number(this.get('inProgressMax'));
        if (_.isNaN(inProgressMax)) {
          inProgressMax = 5;
          this.set('inProgressMax', 5);
        }
        localStorage.inProgressMax = JSON.stringify(inProgressMax);
        baseFontSize = Number(this.get('baseFontSize'));
        if (_.isNaN(baseFontSize)) {
          baseFontSize = 16;
          this.set('inProgressMax', 16);
        }
        localStorage.baseFontSize = JSON.stringify(baseFontSize);
        $body.css('font-size', "" + baseFontSize + "px");
        this.set('settingsOpen', false);
        return this.trigger('settingsUpdated');
      }
    }
  });

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
    needs: 'scopes',
    actions: {
      didSelectProject: function(project) {
        return this.transitionToRoute('project', project.get('id'));
      },
      didSelectScope: function(scope) {
        scope.set('selected', true);
        return this.get('controllers.scopes').send('addScope', scope);
      },
      didUnselectScope: function(scope) {
        scope.set('selected', false);
        return this.get('controllers.scopes').send('removeScope', scope);
      }
    }
  });

}).call(this);

(function() {
  App.ScopeController = Ember.ObjectController.extend({
    actions: {
      expandAll: function() {
        return _.each(this.get('iterations'), function(iteration) {
          return iteration.set('expanded', true);
        });
      },
      collapseAll: function() {
        return _.each(this.get('iterations'), function(iteration) {
          return iteration.set('expanded', false);
        });
      }
    }
  });

}).call(this);

(function() {
  var scopeOrder;

  scopeOrder = ['done', 'current_backlog'];

  App.ScopesController = Ember.ArrayController.extend({
    needs: 'project',
    sortProperties: ['order'],
    count: (function() {
      return "scopes-count-" + (this.get('model.length'));
    }).property('model.length'),
    actions: {
      addScope: function(scope) {
        var projectId, type,
          _this = this;
        projectId = this.get('controllers.project').get('id');
        type = scope.get('type');
        return App.pivotal.getIterations(projectId, type).then(function(iterations) {
          scope = Ember.Object.create({
            id: type,
            name: scope.get('label'),
            order: scopeOrder.indexOf(type),
            iterations: _.map(iterations, function(iteration) {
              iteration.expanded = true;
              iteration.hasStories = iteration.stories.length > 0;
              return Ember.Object.create(iteration);
            })
          });
          return _this.get('model').addObject(scope);
        });
      },
      removeScope: function(scope) {
        var scopeToRemove, scopes;
        scopes = this.get('model');
        scopeToRemove = _.find(scopes, function(thisScope) {
          return thisScope.get('id') === scope.get('type');
        });
        return scopes.removeObject(scopeToRemove);
      },
      toggleExpansion: function(iteration) {
        iteration.toggleProperty('expanded');
      }
    }
  });

}).call(this);

(function() {
  App.MultiSelectComponent = Ember.Component.extend({
    tagName: 'ul',
    classNames: ['multi-select'],
    actions: {
      selectItem: function(item) {
        var numSelected;
        if (item.selected) {
          numSelected = _.where(this.get('items'), {
            selected: true
          }).length;
          if (numSelected > 1) {
            return this.sendAction('onUnselect', item);
          }
        } else {
          return this.sendAction('onSelect', item);
        }
      }
    }
  });

}).call(this);

(function() {
  App.SingleSelectComponent = Ember.Component.extend({
    classNames: ['single-select'],
    classNameBindings: ['expanded'],
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
  Ember.Handlebars.helper('story_icon', function(storyType, estimate) {
    var className;
    className = (function() {
      switch (storyType) {
        case 'feature':
          return 'fa-certificate';
        case 'chore':
          return 'fa-wrench';
        case 'bug':
          return 'fa-bug';
        case 'release':
          return 'fa-flag-checkered';
      }
    })();
    estimate = estimate ? "<span class='estimate'>" + estimate + "</span>" : '';
    return new Ember.Handlebars.SafeString("<i class='fa " + className + "'>" + estimate + "</i>");
  });

}).call(this);

(function() {
  Ember.Handlebars.helper('story_state', function(state) {
    var el;
    if (state) {
      el = "<span class=\"state-meter\"></span>\n<span class=\"state\">" + state + "</span>";
      return new Ember.Handlebars.SafeString(el);
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
  var scopes;

  scopes = [
    {
      label: 'Done',
      type: 'done'
    }, {
      label: 'Backlog',
      type: 'current_backlog',
      selected: true
    }
  ];

  App.ProjectRoute = App.Route.extend({
    model: function(params) {
      return App.pivotal.getProject(params.project_id);
    },
    setupController: function(controller, model) {
      var _this = this;
      this._super();
      localStorage.projectId = JSON.stringify(model.id);
      controller.set('model', model);
      controller.set('scopes', _.map(scopes, function(scope) {
        return Ember.Object.create(scope);
      }));
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
    },
    redirect: function() {
      var projectId;
      projectId = localStorage.projectId;
      if (projectId) {
        return this.transitionTo('project', JSON.parse(projectId));
      }
    }
  });

}).call(this);

(function() {
  var inProgressStoryTypes;

  inProgressStoryTypes = ['started', 'finished', 'delivered', 'rejected'];

  App.ScopesRoute = App.Route.extend({
    deactivate: function() {
      var applicationController;
      applicationController = this.controllerFor('application');
      applicationController.send('hideBanner');
      return applicationController.off('settingsUpdated');
    },
    model: function() {
      var projectId;
      projectId = this.modelFor('project').id;
      return App.pivotal.getIterations(projectId, 'current_backlog').then(function(iterations) {
        var scope;
        scope = Ember.Object.create({
          id: 'current_backlog',
          name: 'Backlog',
          order: 0,
          iterations: _.map(iterations, function(iteration) {
            return Ember.Object.create(iteration);
          })
        });
        return [scope];
      });
    },
    setupController: function(controller, model) {
      var _this = this;
      controller.set('model', model);
      return _.each(model, function(scope) {
        return _.each(scope.get('iterations'), function(iteration, index) {
          var stories;
          if (index === 0) {
            stories = iteration.get('stories');
            _this.checkInProgressStories(stories);
            _this.controllerFor('application').on('settingsUpdated', function() {
              return _this.checkInProgressStories(stories);
            });
          }
          iteration.set('expanded', true);
          return iteration.set('hasStories', iteration.get('stories.length'));
        });
      });
    },
    checkInProgressStories: function(stories) {
      var applicationController, inProgressMax, storiesInProgress;
      storiesInProgress = _.filter(stories, function(story) {
        return _.contains(inProgressStoryTypes, story.current_state);
      });
      inProgressMax = JSON.parse(localStorage.inProgressMax);
      applicationController = this.controllerFor('application');
      if (storiesInProgress.length > inProgressMax) {
        return applicationController.send('showBanner', "There are over " + inProgressMax + " stories in progress", 'warning');
      } else {
        return applicationController.send('hideBanner');
      }
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
