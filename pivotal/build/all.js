(function() {
  var Migrator;

  Migrator = Ember.Object.extend({
    init: function() {
      return this.migrations = {};
    },
    registerMigration: function(version, migration) {
      return this.migrations[version] = migration;
    },
    runMigrations: function() {
      var _this = this;
      return new Ember.RSVP.Promise(function(resolve) {
        var operations, updateVersion, version, versionAssistant, versions;
        version = App.settings.getValue('appVersion', '0.0.0');
        if (version === App.VERSION) {
          return resolve();
        }
        versionAssistant = App.VersionAssistant.create({
          versions: _.keys(_this.migrations)
        });
        versions = versionAssistant.versionsSince(version);
        operations = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = versions.length; _i < _len; _i++) {
            version = versions[_i];
            _results.push(this.migrations[version]());
          }
          return _results;
        }).call(_this);
        updateVersion = new Ember.RSVP.Promise(function(resolve) {
          App.settings.updateString('appVersion', App.VERSION, '0.0.0');
          return resolve();
        });
        operations.push(updateVersion);
        return Ember.RSVP.all(operations).then(function() {
          return resolve();
        });
      });
    }
  });

  App.migrator = Migrator.create();

}).call(this);

(function() {
  var BASE_URL, PROJECT_UPDATES_POLL_INTERVAL, Pivotal, project_data;

  BASE_URL = 'https://www.pivotaltracker.com/services/v5/';

  PROJECT_UPDATES_POLL_INTERVAL = 3 * 1000;

  project_data = void 0;

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
    getIterations: function(projectId) {
      return this.queryPivotal("projects/" + projectId + "/iterations", {
        scope: 'current_backlog'
      }).then(function(iterations) {
        return _.map(iterations, function(iteration) {
          return Ember.Object.create({
            start: new Date(iteration.start),
            finish: new Date(iteration.finish),
            expanded: true,
            stories: _.map(iteration.stories, function(story) {
              var curatedStory;
              curatedStory = _.pick(story, 'id', 'name', 'current_state', 'story_type', 'estimate', 'accepted_at');
              curatedStory.labels = _.pluck(story.labels, 'name');
              return curatedStory;
            })
          });
        });
      });
    },
    listenForProjectUpdates: function(projectId) {
      var _this = this;
      if ((project_data != null) && project_data.projectId !== projectId) {
        clearInterval(project_data.interval);
      }
      project_data = {
        projectId: projectId,
        handlers: []
      };
      this.queryPivotal("projects/" + projectId).then(function(project) {
        project_data.version = project.version;
        return project_data.interval = setInterval((function() {
          return _this.queryPivotal("project_stale_commands/" + projectId + "/" + project_data.version).then(function(info) {
            var handler, _i, _len, _ref, _results;
            if (project_data.version !== info.project_version) {
              _ref = (project_data != null ? project_data.handlers : void 0) || [];
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                handler = _ref[_i];
                _results.push(handler());
              }
              return _results;
            }
          });
        }), PROJECT_UPDATES_POLL_INTERVAL);
      });
      return {
        then: function(fn) {
          return project_data.handlers.push(fn);
        }
      };
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
        value = defaultValue;
      }
      localStorage[key] = JSON.stringify(value);
      return value;
    },
    updateString: function(key, value, defaultValue) {
      value = value.toString();
      if ($.trim(value) === '') {
        value = defaultValue;
      }
      localStorage[key] = JSON.stringify(value);
      return value;
    }
  });

  App.settings = Settings.create();

}).call(this);

(function() {
  App.VersionAssistant = Ember.Object.extend({
    init: function() {
      return this.sortMigrations();
    },
    sortMigrations: function() {
      var _this = this;
      return this.get('versions').sort(function(a, b) {
        return _this.versionSorter(a, b);
      });
    },
    versionSorter: function(a, b) {
      var aMajor, aMinor, aPatch, bMajor, bMinor, bPatch, _ref, _ref1;
      _ref = this.convertToVersionArray(a), aMajor = _ref[0], aMinor = _ref[1], aPatch = _ref[2];
      _ref1 = this.convertToVersionArray(b), bMajor = _ref1[0], bMinor = _ref1[1], bPatch = _ref1[2];
      if (aMajor !== bMajor) {
        return aMajor - bMajor;
      }
      if (aMinor !== bMinor) {
        return aMinor - bMinor;
      }
      if (aPatch !== bPatch) {
        return aPatch - bPatch;
      }
      return 0;
    },
    convertToVersionArray: function(version) {
      return _.map(version.split('.'), function(numString) {
        return Number(numString);
      });
    },
    versionsSince: function(version) {
      var index, versions,
        _this = this;
      versions = _.clone(this.get('versions'));
      index = _.indexOf(versions, version);
      if (index < 0) {
        versions.push(version);
        versions.sort(function(a, b) {
          return _this.versionSorter(a, b);
        });
        index = _.indexOf(versions, version);
      }
      return versions.slice(index + 1);
    }
  });

}).call(this);

(function() {
  var $body;

  $body = Ember.$('body');

  App.ApplicationController = Ember.Controller.extend(Ember.Evented, {
    needs: 'settings',
    init: function() {
      var _this = this;
      this._super();
      this.updateBaseFontSize();
      return Ember.run.later(function() {
        return _this.set('fullscreen', true);
      });
    },
    handleFullscreen: (function() {
      var action;
      action = this.get('fullscreen') ? 'addClass' : 'removeClass';
      return Ember.$('body')[action]('fullscreen');
    }).observes('fullscreen'),
    updateBaseFontSize: (function() {
      var baseFontSize;
      baseFontSize = this.get('controllers.settings.baseFontSize');
      return $body.css('font-size', "" + baseFontSize + "px");
    }).observes('controllers.settings.baseFontSize'),
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
      }
    }
  });

}).call(this);

(function() {
  App.IterationController = Ember.ObjectController.extend({
    needs: 'settings',
    hasStories: Ember.computed.gt('filteredStories.length', 0),
    sttgCtrl: Ember.computed.alias('controllers.settings'),
    filteredStories: (function() {
      var cutoff, numAcceptedStories, showAcceptedType, showAcceptedValue, stories,
        _this = this;
      stories = this.get('stories');
      showAcceptedType = this.get('sttgCtrl.showAcceptedType');
      showAcceptedValue = this.get('sttgCtrl.showAcceptedValue');
      cutoff = showAcceptedType === 'count' ? (numAcceptedStories = (_.filter(stories, function(story) {
        return _this.storyIsAccepted(story);
      })).length, cutoff = numAcceptedStories - showAcceptedValue, cutoff >= 0 ? cutoff : 0) : moment().startOf('day').subtract('days', showAcceptedValue).unix();
      return _.filter(stories, function(story, index) {
        var value;
        if (_this.storyIsAccepted(story)) {
          value = showAcceptedType === 'count' ? index : moment(story.accepted_at).startOf('day').unix();
          return value >= cutoff;
        } else {
          return true;
        }
      });
    }).property('stories', 'sttgCtrl.showAcceptedType', 'sttgCtrl.showAcceptedValue'),
    storyIsAccepted: function(story) {
      return story.current_state === 'accepted';
    },
    actions: {
      toggleExpansion: function() {
        this.toggleProperty('expanded');
      }
    }
  });

}).call(this);

(function() {
  App.IterationsController = Ember.ArrayController.extend({
    actions: {
      toggleIterations: function(expand) {
        return _.each(this.get('model'), function(iteration) {
          return iteration.set('expanded', expand);
        });
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
    needs: 'iterations',
    actions: {
      didSelectProject: function(project) {
        return this.transitionToRoute('project', project.get('id'));
      },
      expandAllIterations: function() {
        return this.get('controllers.iterations').send('toggleIterations', true);
      },
      collapseAllIterations: function() {
        return this.get('controllers.iterations').send('toggleIterations', false);
      }
    }
  });

}).call(this);

(function() {
  App.SettingsController = Ember.Controller.extend({
    needs: 'application',
    init: function() {
      var baseFontSize, inProgressMax, showAcceptedType, showAcceptedValue;
      this._super();
      baseFontSize = App.settings.getValue('baseFontSize', 16);
      this.set('baseFontSize', baseFontSize);
      inProgressMax = App.settings.getValue('inProgressMax', 5);
      this.set('inProgressMax', inProgressMax);
      showAcceptedType = App.settings.getValue('showAcceptedType', 'count');
      this.set('showAcceptedType', showAcceptedType);
      showAcceptedValue = App.settings.getValue('showAcceptedValue', 2);
      return this.set('showAcceptedValue', showAcceptedValue);
    },
    showAcceptedTypes: ['count', 'age'],
    showAcceptedPrefix: (function() {
      switch (this.get('showAcceptedType')) {
        case 'count':
          return 'Show up to';
        case 'age':
          return 'Show accepted stories up to';
      }
    }).property('showAcceptedType'),
    showAcceptedSuffix: (function() {
      var inflectedDay, inflectedStory;
      if (this.get('showAcceptedValue') === 1) {
        inflectedStory = 'story';
        inflectedDay = 'day';
      } else {
        inflectedStory = 'stories';
        inflectedDay = 'days';
      }
      switch (this.get('showAcceptedType')) {
        case 'count':
          return "accepted " + inflectedStory;
        case 'age':
          return "" + inflectedDay + " old";
      }
    }).property('showAcceptedType', 'showAcceptedValue'),
    actions: {
      saveSettings: function() {
        var applicationController;
        App.settings.updateNumber('inProgressMax', this.get('inProgressMax'), 5);
        App.settings.updateNumber('baseFontSize', this.get('baseFontSize'), 16);
        App.settings.updateString('showAcceptedType', this.get('showAcceptedType'), 'count');
        App.settings.updateNumber('showAcceptedValue', this.get('showAcceptedValue'), 2);
        applicationController = this.get('controllers.application');
        return applicationController.send('closeSettings');
      }
    }
  });

}).call(this);

(function() {
  App.IterationView = Ember.View.extend({
    tagName: 'article',
    classNames: ['iteration'],
    classNameBindings: ['controller.expanded']
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
  Ember.Handlebars.helper('markdown', function(str) {
    return new Ember.Handlebars.SafeString(markdown.toHTML(str));
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
  App.ApplicationRoute = Ember.Route.extend({
    beforeModel: function() {
      return App.migrator.runMigrations();
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
  var inProgressStoryTypes;

  inProgressStoryTypes = ['started', 'finished', 'delivered', 'rejected'];

  App.IterationsRoute = App.Route.extend({
    model: function() {
      return App.pivotal.getIterations(this.modelFor('project').id);
    },
    setupController: function(controller, model) {
      var projectId, stories,
        _this = this;
      controller.set('model', model);
      if (model.get('length')) {
        stories = model.get('firstObject.stories');
        this.checkInProgressStories(stories);
        this.controllerFor('application').on('settingsUpdated', function() {
          return _this.checkInProgressStories(stories);
        });
      }
      projectId = this.modelFor('project').id;
      return App.pivotal.listenForProjectUpdates(projectId).then(function() {
        return _this.transitionTo('project', projectId);
      });
    },
    checkInProgressStories: function(stories) {
      var appController, inProgressMax, storiesInProgress;
      storiesInProgress = _.filter(stories, function(story) {
        return _.contains(inProgressStoryTypes, story.current_state);
      });
      inProgressMax = App.settings.getValue('inProgressMax', 5);
      appController = this.controllerFor('application');
      if (storiesInProgress.length > inProgressMax) {
        return appController.send('showBanner', "There are over " + inProgressMax + " stories in progress", 'warning');
      } else {
        return appController.send('hideBanner');
      }
    },
    deactivate: function() {
      var appController;
      appController = this.controllerFor('application');
      appController.send('hideBanner');
      return appController.off('settingsUpdated');
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
      controller.set('model', model);
      localStorage.projectId = JSON.stringify(model.id);
      return App.pivotal.getProjects().then(function(projects) {
        controller.set('projects', _.map(projects, function(project) {
          return Ember.Object.create(project);
        }));
        return _this.transitionTo('iterations');
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
  App.Router.map(function() {
    this.route('login');
    this.resource('projects');
    return this.resource('project', {
      path: 'projects/:project_id'
    }, function() {
      return this.resource('iterations');
    });
  });

}).call(this);
