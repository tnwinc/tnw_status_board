// ==UserScript==
// @match https://*.pivotaltracker.com/*
// ==/UserScript==

setInterval(function() {
	document.getElementById('header').style.display = 'none';
	document.getElementById('controlPanel').style.display = 'none';


	var alterStuff = function (classToAlter, styleToChange) {
		var els = document.getElementsByClassName(classToAlter);
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


	hideStuff('toggleExpandedButton');
	hideStuff('storySelector');
	hideStuff('panelHeader');
	hideStuff('panelHeaderLeft');
	hideStuff('panelHeaderRight');
	hideStuff('storyLabels');
	hideStuff('flyoverIcon');
	hideStuff('accepted');
	alterStuff('storyPreviewText', function(el) { 
		el.style.fontSize = '28px';
		el.style.marginTop = '5px';
		el.style.marginBottom = '5px';
		el.style.lineHeight = '.9em';
	})
	alterStuff('estimate', function(el) { 
		el.style.fontSize = '28px';
	})
	alterStuff('inner', function(el) { 
		el.style.overflow = 'hidden';
	})
	alterStuff('layout', function(el) { 
		el.style.marginTop = '5px';
		el.style.borderSpacing = '0';
	})
	alterStuff('iterationHeader', function(el) { 
		el.style.height = '40px';
	})
        alterStuff('date', function(el) {
        	el.style.fontSize = '28px';
        })
        alterStuff('iteration_length', function(el) {
        	el.style.fontSize = '28px';
        })
        alterStuff('points', function(el) {
        	el.style.fontSize = '28px';
        })
	var backlogList = document.getElementById("backlog_itemList");
	backlogList.style.height = 'auto';
}, 500)
