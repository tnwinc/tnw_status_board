(function () {

  var current = 0;
  var countdown = document.getElementById("countdown");
  var content = document.getElementById("content");

  var start = function () {
    content.style.height = (window.innerHeight - 15) + "px";
    window.setInterval(checkDiags, 60000 * 5);
    checkDiags();
  };

  var getDiags = function() {
    var status;
    var counter = 0;
    var diags = [];
    diag = localStorage.getItem("ping_pong_" + counter);
    while(diag) {
      diags.push(JSON.parse(diag));
      counter++;
      diag = localStorage.getItem("ping_pong_" + counter);
    }
    console.log("Got Diagnostics to ping: ", diags);
    return diags;
  };

  var burnDown = function(){
    countdown.className = "reset";
    window.setTimeout(function(){
      content.className = "content shown";
      countdown.className = "burndown";
    }, 300);
  };

  var check = function(url, element) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'document';

    xhr.onloadend = function(e) {
      console.log("Got response for ", url, this);
      if (this.status >= 200 && this.status < 300) {
        element.className = "success";
      } else {
        element.className = "error";
      }
    };

    xhr.send();
  };

  var checkDiags = function() {
    var diags = getDiags();
    content.innerHTML = '';
    for(var i in diags) {
      var diag = diags[i];
      console.log("pinging ", diag.url);
      var ping = document.createElement("li");
      ping.className = "pending";
      ping.appendChild(document.createTextNode(diag.name));
      content.appendChild(ping);
      window.setTimeout(check, 1000, diag.url, ping);
    }
    if(diags) {
      burnDown();
    }
  };

  var fixtureMode = function () {
    document.getElementById('fixtures').className = 'content';
  };

  var hash = window.location.hash;

  if (hash === '#fixture') {
    fixtureMode();
  } else {
    start();
  }

}());
