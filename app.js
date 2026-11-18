(function () {
  'use strict';
  var USER = 'hyik007';
  document.getElementById('year').textContent = new Date().getFullYear();

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  var grid = document.getElementById('repo-grid');
  var stats = document.getElementById('stats');

  function addStat(label, value) {
    var s = el('div', 'stat');
    s.appendChild(el('b', '', String(value)));
    s.appendChild(el('span', '', label));
    stats.appendChild(s);
  }

  fetch('https://api.github.com/users/' + USER + '/repos?per_page=100&sort=updated')
    .then(function (r) {
      if (!r.ok) throw new Error('GitHub API ' + r.status);
      return r.json();
    })
    .then(function (repos) {
      var own = repos.filter(function (r) { return !r.fork && r.name.toLowerCase() !== USER; });
      var stars = own.reduce(function (n, r) { return n + r.stargazers_count; }, 0);
      stats.textContent = '';
      addStat('Public repos', own.length);
      addStat('Total stars', stars);
      grid.textContent = '';
      if (!own.length) {
        grid.appendChild(el('p', 'muted', 'No public repositories yet.'));
        return;
      }
      own.forEach(function (r) {
        var a = el('a', 'card');
        a.href = r.homepage || r.html_url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.appendChild(el('h3', '', r.name));
        a.appendChild(el('p', '', r.description || 'No description yet.'));
        var meta = el('div', 'meta');
        if (r.language) meta.appendChild(el('span', '', r.language));
        meta.appendChild(el('span', '', '★ ' + r.stargazers_count));
        meta.appendChild(el('span', '', 'Updated ' + new Date(r.pushed_at).toLocaleDateString()));
        a.appendChild(meta);
        grid.appendChild(a);
      });
    })
    .catch(function () {
      grid.textContent = '';
      var p = el('p', 'muted', 'Could not load repositories right now. ');
      var link = el('a', '', 'View them on GitHub →');
      link.href = 'https://github.com/' + USER + '?tab=repositories';
      link.style.color = '#a5b4fc';
      p.appendChild(link);
      grid.appendChild(p);
    });
})();
