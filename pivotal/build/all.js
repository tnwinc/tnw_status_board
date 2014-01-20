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
    getIterations: function(projectId, conditions) {
      if (conditions == null) {
        conditions = {};
      }
      return this.queryPivotal("projects/" + projectId + "/iterations", conditions).then(function(iterations) {
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
  var Settings;

  Settings = Ember.Object.extend({
    getValue: function(key, defaultValue) {
      var value;
      value = localStorage[key];
      if (!value) {
        localStorage[key] = value = JSON.stringify(defaultValue);
      }
      return JSON.parse(value);
    },
    updateNumber: function(key, value, defaultValue) {
      value = Number(value);
      if (_.isNaN(value)) {
        value = 5;
      }
      localStorage[key] = JSON.stringify(value);
      return value;
    }
  });

  App.settings = Settings.create();

}).call(this);

(function() {
  var $body;

  $body = Ember.$('body');

  App.ApplicationController = Ember.Controller.extend(Ember.Evented, {
    init: function() {
      var baseFontSize;
      this._super();
      baseFontSize = App.settings.getValue('baseFontSize', 16);
      this.send('updateBaseFontSize', baseFontSize);
      this.set('fullscreen', true);
      return $body.addClass('fullscreen');
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
      closeSettings: function() {
        this.set('settingsOpen', false);
        return this.trigger('settingsUpdated');
      },
      updateBaseFontSize: function(baseFontSize) {
        return $body.css('font-size', "" + baseFontSize + "px");
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
  var inProgressStoryTypes;

  inProgressStoryTypes = ['started', 'finished', 'delivered', 'rejected'];

  App.ScopesController = Ember.ArrayController.extend({
    needs: ['application', 'project'],
    sortProperties: ['order'],
    count: (function() {
      return "scopes-count-" + (this.get('model.length'));
    }).property('model.length'),
    checkInProgressStories: function(stories) {
      var applicationController, inProgressMax, storiesInProgress;
      storiesInProgress = _.filter(stories, function(story) {
        return _.contains(inProgressStoryTypes, story.current_state);
      });
      inProgressMax = JSON.parse(localStorage.inProgressMax);
      applicationController = this.get('controllers.application');
      if (storiesInProgress.length > inProgressMax) {
        return applicationController.send('showBanner', "There are over " + inProgressMax + " stories in progress", 'warning');
      } else {
        return applicationController.send('hideBanner');
      }
    },
    actions: {
      addScope: function(scope) {
        var conditions, projectId,
          _this = this;
        projectId = this.get('controllers.project').get('id');
        conditions = scope.get('conditions') || {};
        conditions.scope = scope.get('id');
        return App.pivotal.getIterations(projectId, conditions).then(function(iterations) {
          scope = Ember.Object.create(scope);
          scope.set('iterations', _.map(iterations, function(iteration, index) {
            iteration.expanded = true;
            iteration.hasStories = iteration.stories.length > 0;
            if (scope.get('id') === 'current_backlog' && index === 0 && iteration.hasStories) {
              _this.checkInProgressStories(iteration.stories);
              _this.get('controllers.application').on('settingsUpdated', function() {
                return _this.checkInProgressStories(iteration.stories);
              });
            }
            return Ember.Object.create(iteration);
          }));
          return _this.get('model').addObject(scope);
        });
      },
      removeScope: function(scope) {
        var scopeToRemove, scopes;
        scopes = this.get('model');
        scopeToRemove = _.find(scopes, function(thisScope) {
          return thisScope.get('id') === scope.get('id');
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
  App.SettingsController = Ember.Controller.extend({
    needs: 'application',
    init: function() {
      var baseFontSize, inProgressMax;
      this._super();
      baseFontSize = App.settings.getValue('baseFontSize', 16);
      this.set('baseFontSize', baseFontSize);
      this.get('controllers.application').send('updateBaseFontSize', baseFontSize);
      inProgressMax = App.settings.getValue('inProgressMax', 5);
      return this.set('inProgressMax', inProgressMax);
    },
    updateBaseFontSize: (function() {
      return this.get('controllers.application').send('updateBaseFontSize', this.get('baseFontSize'));
    }).observes('baseFontSize'),
    actions: {
      saveSettings: function() {
        var applicationController, baseFontSize;
        App.settings.updateNumber('inProgressMax', this.get('inProgressMax'), 5);
        baseFontSize = App.settings.updateNumber('baseFontSize', this.get('baseFontSize'), 16);
        applicationController = this.get('controllers.application');
        applicationController.send('updateBaseFontSize', baseFontSize);
        return applicationController.send('closeSettings');
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
      id: 'done',
      order: 0,
      name: 'Done',
      conditions: {
        offset: -10
      }
    }, {
      id: 'current_backlog',
      order: 1,
      name: 'Backlog',
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
          return Ember.Object.create(project);
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
  App.ScopesRoute = App.Route.extend({
    model: function() {
      return [];
    },
    setupController: function(controller, model) {
      controller.set('model', model);
      return _.each(this.controllerFor('project').get('scopes'), function(scope) {
        if (scope.get('selected')) {
          return controller.send('addScope', scope);
        }
      });
    },
    deactivate: function() {
      var applicationController;
      applicationController = this.controllerFor('application');
      applicationController.send('hideBanner');
      return applicationController.off('settingsUpdated');
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
