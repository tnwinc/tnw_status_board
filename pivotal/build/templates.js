Ember.TEMPLATES["_story"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n      <li class=\"label\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</li>\n    ");
  return buffer;
  }

  data.buffer.push("<li ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("current_state story_type")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || (depth0 && depth0['bind-attr'])),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(">\n  ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0,depth0],types:["ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.story_icon || (depth0 && depth0.story_icon)),stack1 ? stack1.call(depth0, "story_type", "estimate", options) : helperMissing.call(depth0, "story_icon", "story_type", "estimate", options))));
  data.buffer.push("\n  ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.story_state || (depth0 && depth0.story_state)),stack1 ? stack1.call(depth0, "current_state", options) : helperMissing.call(depth0, "story_state", "current_state", options))));
  data.buffer.push("\n  <ul class=\"labels\">\n    ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers.each.call(depth0, "labels", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n  </ul>\n  ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.markdown || (depth0 && depth0.markdown)),stack1 ? stack1.call(depth0, "name", options) : helperMissing.call(depth0, "markdown", "name", options))));
  data.buffer.push("\n</li>\n");
  return buffer;
  
});
Ember.TEMPLATES["application"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n  <div ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("banner.type :banner")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || (depth0 && depth0['bind-attr'])),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(">\n    ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "banner.message", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n  </div>\n");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n  ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || (depth0 && depth0.render)),stack1 ? stack1.call(depth0, "settings", options) : helperMissing.call(depth0, "render", "settings", options))));
  data.buffer.push("\n");
  return buffer;
  }

function program5(depth0,data) {
  
  
  data.buffer.push("\n    <i class=\"fa fa-compress\"></i>\n  ");
  }

function program7(depth0,data) {
  
  
  data.buffer.push("\n    <i class=\"fa fa-expand\"></i>\n  ");
  }

  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "banner", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n\n<a href=\"#\" class=\"open-settings\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "openSettings", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n  <i class=\"fa fa-cogs\"></i>\n</a>\n\n");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "settingsOpen", {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n<a href=\"#\" class=\"toggle-fullscreen\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleFullscreen", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n  ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "fullscreen", {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</a>\n");
  return buffer;
  
});
Ember.TEMPLATES["components/single-select"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n    <li ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("current")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || (depth0 && depth0['bind-attr'])),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(">\n      <a href=\"#\" ");
  hashContexts = {'bubbles': depth0};
  hashTypes = {'bubbles': "BOOLEAN"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "selectItem", "", {hash:{
    'bubbles': (false)
  },contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" ");
  hashContexts = {'title': depth0};
  hashTypes = {'title': "ID"};
  options = {hash:{
    'title': ("label")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || (depth0 && depth0['bind-attr'])),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(">\n        ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n      </a>\n    </li>\n  ");
  return buffer;
  }

  data.buffer.push("<ul>\n  ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "curatedItems", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</ul>\n<a href=\"#\" class=\"toggle-expansion\" ");
  hashContexts = {'bubbles': depth0};
  hashTypes = {'bubbles': "BOOLEAN"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleExpansion", {hash:{
    'bubbles': (false)
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n  ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.expando_icon || (depth0 && depth0.expando_icon)),stack1 ? stack1.call(depth0, "expanded", options) : helperMissing.call(depth0, "expando_icon", "expanded", options))));
  data.buffer.push("\n</a>\n");
  return buffer;
  
});
Ember.TEMPLATES["iteration"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n    <a href=\"#\" class=\"toggle-expansion\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleExpansion", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n      ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.expando_icon || (depth0 && depth0.expando_icon)),stack1 ? stack1.call(depth0, "expanded", options) : helperMissing.call(depth0, "expando_icon", "expanded", options))));
  data.buffer.push("\n    </a>\n  ");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n    ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.partial || (depth0 && depth0.partial)),stack1 ? stack1.call(depth0, "story", options) : helperMissing.call(depth0, "partial", "story", options))));
  data.buffer.push("\n  ");
  return buffer;
  }

  data.buffer.push("<header>\n  <h4>");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.date || (depth0 && depth0.date)),stack1 ? stack1.call(depth0, "start", options) : helperMissing.call(depth0, "date", "start", options))));
  data.buffer.push(" - ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.date || (depth0 && depth0.date)),stack1 ? stack1.call(depth0, "finish", options) : helperMissing.call(depth0, "date", "finish", options))));
  data.buffer.push("</h4>\n  ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "hasStories", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n</header>\n\n<ul class=\"stories\">\n  ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers.each.call(depth0, "filteredStories", {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n</ul>\n");
  return buffer;
  
});
Ember.TEMPLATES["iterations"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n    ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || (depth0 && depth0.render)),stack1 ? stack1.call(depth0, "iteration", "", options) : helperMissing.call(depth0, "render", "iteration", "", options))));
  data.buffer.push("\n  ");
  return buffer;
  }

  data.buffer.push("<section class=\"iterations\">\n  ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</section>\n");
  return buffer;
  
});
Ember.TEMPLATES["login"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  data.buffer.push("<section class=\"login-container\">\n\n  <h2>Please Authenticate</h2>\n\n  <form ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "submit", {hash:{
    'on': ("submit")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n    ");
  hashContexts = {'value': depth0,'type': depth0,'placeholder': depth0};
  hashTypes = {'value': "ID",'type': "STRING",'placeholder': "STRING"};
  options = {hash:{
    'value': ("token"),
    'type': ("text"),
    'placeholder': ("API Token")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || (depth0 && depth0.input)),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n    <button type=\"submit\">Authenticate</button>\n  </form>\n\n</section>\n");
  return buffer;
  
});
Ember.TEMPLATES["project"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<header class=\"project\">\n  ");
  hashContexts = {'items': depth0,'currentItemId': depth0,'onSelect': depth0};
  hashTypes = {'items': "ID",'currentItemId': "ID",'onSelect': "STRING"};
  options = {hash:{
    'items': ("projects"),
    'currentItemId': ("id"),
    'onSelect': ("didSelectProject")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['single-select'] || (depth0 && depth0['single-select'])),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "single-select", options))));
  data.buffer.push("\n\n  <ul class=\"expando-all\">\n    <li>\n      <a href=\"#\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "expandAllIterations", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"expand-all\" title=\"Expand All\">\n        <i class=\"fa fa-toggle-down\"></i>\n      </a>\n    </li>\n    <li>\n      <a href=\"#\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "collapseAllIterations", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"collapse-all\" title=\"Collapse All\">\n        <i class=\"fa fa-toggle-up\"></i>\n      </a>\n    </li>\n  </ul>\n</header>\n\n");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  return buffer;
  
});
Ember.TEMPLATES["projects"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options;
  data.buffer.push("\n      <li>\n        ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || (depth0 && depth0['link-to'])),stack1 ? stack1.call(depth0, "project", "", options) : helperMissing.call(depth0, "link-to", "project", "", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n      </li>\n    ");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n          ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n        ");
  return buffer;
  }

  data.buffer.push("<section class=\"projects-container\">\n\n  <h2>Projects</h2>\n\n  <ul>\n    ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </ul>\n\n</section>\n");
  return buffer;
  
});
Ember.TEMPLATES["settings"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  data.buffer.push("<form class=\"settings\" ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "saveSettings", {hash:{
    'on': ("submit")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n  <fieldset>\n    <label for=\"in-progress-max\">Max. stories in progress before warning:</label>\n    ");
  hashContexts = {'value': depth0,'for': depth0,'type': depth0,'min': depth0};
  hashTypes = {'value': "ID",'for': "STRING",'type': "STRING",'min': "STRING"};
  options = {hash:{
    'value': ("inProgressMax"),
    'for': ("in-progress-max"),
    'type': ("number"),
    'min': ("0")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || (depth0 && depth0.input)),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n  </fieldset>\n\n  <fieldset>\n    <label for=\"base-font-size\">Base font size:</label>\n    ");
  hashContexts = {'value': depth0,'for': depth0,'type': depth0,'min': depth0};
  hashTypes = {'value': "ID",'for': "STRING",'type': "STRING",'min': "STRING"};
  options = {hash:{
    'value': ("baseFontSize"),
    'for': ("base-font-size"),
    'type': ("number"),
    'min': ("10")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || (depth0 && depth0.input)),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n    <span class=\"suffix\">px</span>\n  </fieldset>\n\n  <fieldset>\n    <label for=\"show-accepted-type\">Limit accepted stories by</label>\n    ");
  hashContexts = {'content': depth0,'value': depth0,'for': depth0};
  hashTypes = {'content': "ID",'value': "ID",'for': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'content': ("showAcceptedTypes"),
    'value': ("showAcceptedType"),
    'for': ("show-accepted-type")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n  </fieldset>\n\n  <fieldset>\n    <label for=\"show-accepted-value\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "showAcceptedPrefix", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</label>\n    ");
  hashContexts = {'value': depth0,'for': depth0,'type': depth0,'min': depth0};
  hashTypes = {'value': "ID",'for': "STRING",'type': "STRING",'min': "STRING"};
  options = {hash:{
    'value': ("showAcceptedValue"),
    'for': ("show-accepted-value"),
    'type': ("number"),
    'min': ("0")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || (depth0 && depth0.input)),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n    <span class=\"suffix\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "showAcceptedSuffix", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span>\n  </fieldset>\n\n  <button type=\"submit\">Save</button>\n</form>\n");
  return buffer;
  
});