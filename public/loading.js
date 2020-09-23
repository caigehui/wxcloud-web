(function() {
  var theme = localStorage.getItem('wxeap_theme');
  var bgColor, pColor;
  if (theme === '"UNICORN"') {
    bgColor = '#2a2d3d';
    pColor = '#a67dff';
  } else if (theme === '"ONE_DARK"') {
    bgColor = '#282C34';
    pColor = '#8a85ff';
  } else if (theme === '"LIGHT"') {
    bgColor = '#f4f6f8';
    pColor = '#3f51b5';
  } else {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      bgColor = '#282C34';
      pColor = '#8a85ff';
    } else {
      bgColor = '#f4f6f8';
      pColor = '#3f51b5';
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
