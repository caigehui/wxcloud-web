(function() {
  var theme = localStorage.getItem('wxeap_theme');
  var bgColor;
  var pColor = '#4889F4';
  if (theme === '"ONE_DARK"') {
    bgColor = '#282C34';
  } else if (theme === '"LIGHT"') {
    bgColor = '#f4f6f8';
  } else {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      bgColor = '#282C34';
      pColor = '#4889F4';
    } else {
      bgColor = '#f4f6f8';
    }
  }
  var el = document.getElementById('wx-loading');
  if (el) {
    el.style.backgroundColor = bgColor;
    var x = document.getElementsByClassName('wx-object');
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].style.backgroundColor = pColor;
    }
  }
})();
