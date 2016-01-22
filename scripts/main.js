$(document).ready(function() {
  $.get('https://api.github.com/repos/silverlight513/Rownd/releases').done(function(data) {
    var url = data[0].zipball_url;

    // Add url to all hrefs that need it
    var $hrefs = $('a.download-link');
    for (var i = $hrefs.length - 1; i >= 0; i--) {
      $hrefs[i].href = url;
    };
  });
});