// Clusters refactoren naar generiek tab script
//de normale clusters omzetten naar tabbed clusters
function iniClusters() {
  var deClusters = document.querySelectorAll('.cluster');
  var nieuweRadio;
  var nieuwLabel;

  if (deClusters.length > 1) {
    //voeg een radio button met label toe voor elk cluster
    for (var i = 0; i < deClusters.length; i++) {
      if (deClusters[i].hasAttribute('title') && deClusters[i].title !== '') {
        deClusters[i].classList.add('tabbed');

        nieuweRadio = document.createElement('input');
        nieuweRadio.type = 'radio';
        nieuweRadio.name = 'cluster';
        nieuweRadio.id = 'cluster' + deClusters[i].title;
        nieuweRadio.value = 'cluster' + deClusters[i].title;
        nieuweRadio.setAttribute('onclick', 'handleButtonClick(event);');

        nieuwLabel = document.createElement('label');
        if (
          deClusters[i].querySelector('h2') !== null &&
          deClusters[i].querySelector('h2').innerHTML.trim() !== ''
        ) {
          nieuwLabel.appendChild(deClusters[i].querySelector('h2'));
        } else {
          nieuwLabel.appendChild(document.createElement('h2'));
          nieuwLabel.firstChild.innerHTML = 'cluster ' + i;
        }
        nieuwLabel.setAttribute('for', 'cluster' + deClusters[i].title);

        deClusters[0].parentNode.insertBefore(nieuweRadio, deClusters[0]);
        deClusters[0].parentNode.insertBefore(nieuwLabel, deClusters[0]);
      }
    }

    //check indien er een cookie is de radio button van het cluster van de student en anders de eerste
    if (
      document.cookie.split(';').filter(function(item) {
        return item.indexOf('myCluster=') >= 0;
      }).length
    ) {
      document.querySelector(
        '#' +
          document.cookie.replace(
            /(?:(?:^|.*;\s*)myCluster\s*\=\s*([^;]*).*$)|^.*$/,
            '$1'
          )
      ).checked = true;
    } else {
      document.querySelector(
        "input[name='cluster']:first-of-type"
      ).checked = true;
    }
  }
}

//naast cluster wisselen ook value van cookie aanpassen - wordt geinitieerd door onchange in HTML
function handleButtonClick(event) {
  document.cookie =
    'myCluster=' + event.target.id + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
}

//na laden van document clusters initiatie starten
document.addEventListener('DOMContentLoaded', function() {
  iniClusters();
});
