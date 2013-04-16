// ==UserScript==
// @name Pivotal Biggify
// @description Makes Pivotal usable on a big board
// @match https://*.pivotaltracker.com/*
// ==/UserScript==
 
  setInterval(function() {
    document.styleSheets[0].insertRule("header.preview span.meta:after { display: none; }")

    var alterStuff = function (classToAlter, styleToChange) {
      var els = document.querySelectorAll(classToAlter);
      var elsArray = Array.prototype.slice.call(els, 0);
      elsArray.forEach(function(el) {
        styleToChange(el);
      });
    }
 
    var hideStuff = function (classToHide) {
      alterStuff(classToHide, function(el) {
        el.style.display = 'none';
      })
    }

    hideStuff('header.project');
    hideStuff('header.panel_header')
    hideStuff('a.expander');
    hideStuff('a.selector');
    hideStuff('panelHeader');
    hideStuff('panelHeaderLeft');
    hideStuff('panelHeaderRight');
    hideStuff('storyLabels');
    hideStuff('flyoverIcon');
    hideStuff('section.items_container div.accepted');

    alterStuff('section.items_container div.panel_content', function(el) {
      el.style.top = 0;
    });

    alterStuff('section.panels', function(el) {
      el.style.top = 0;
    });

    alterStuff('section.panels div.table', function(el) {
      el.style.padding = 0;
    });

    alterStuff('section.panels div.panel', function(el) {
      el.style.padding = 0;
    });

    alterStuff('section.panels div.container', function(el) {
      el.style.position = '';
    });

    alterStuff('header.preview a.label', function(el) {
        el.style.display = 'none';
    });

    alterStuff('header.preview label.button', function(el) {
        el.style.marginTop = '5px';
    });

    alterStuff('header.preview', function(el) { 
      el.style.fontSize = '28px';
      el.style.marginTop = '1px';
      el.style.marginBottom = '1px';
      el.style.lineHeight = '.9em';
    });

    alterStuff('div.iteration header.preview', function(el) { 
      el.style.height = '26px';
    });

    alterStuff('header.preview span.name', function(el) { 
      el.style.marginLeft = '5px';
      for(var i = 0; i < el.childNodes.length; i++) { 
        var node = el.childNodes.item(i); 
        if (node.nodeType == 3 && node.textContent.trim() == ',')  
          el.removeChild(node); 
      }      

    });

    alterStuff('header.preview span.meta', function(el) { 
      el.style.lineHeight = '.8em';
    });

    alterStuff('header.preview span.meta span', function(el) { 
      el.style.fontSize = '28px';
      el.style.width = '32px';
      el.style.marginLeft = '-2px';
    });
  }, 500)
