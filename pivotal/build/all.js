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
              curatedStory = _.pick(story, 'id', 'name', 'current_state', 'story_type', 'estimate');
              curatedStory.labels = _.pluck(story.labels, 'name');
              return curatedStory;
            })
          });
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
        value = defaultValue;
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
  App.IterationController = Ember.ObjectController.extend({
    hasStories: Ember.computed.gt('stories.length', 0),
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
      var stories,
        _this = this;
      controller.set('model', model);
      if (model.get('length')) {
        stories = model.get('firstObject.stories');
        this.checkInProgressStories(stories);
        return this.controllerFor('application').on('settingsUpdated', function() {
          return _this.checkInProgressStories(stories);
        });
      }
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
