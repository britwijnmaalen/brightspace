/*
*
* Loosely based on:
*   - https://dev.to/shoupn/javascript-fetch-api-and-using-asyncawait-47mp
*   - https://dev.to/niinpatel/converting-xml-to-json-using-recursion-2k4j
*   -
*/

if (document.body.contains(document.getElementById('news'))) {
  getNews();
}

function getNews() {
  const feeds = {
    cmdlo: 'https://dlo.mijnhva.nl/d2l/le/news/rss/59296/course?ou=59296',
    fdmci: 'http://www.hva.nl/faculteit/fdmci/nieuws/nieuwsoverzicht.rss',
    proxy: 'https://cors-anywhere.herokuapp.com/',
    local: '/assets/script/rss.xml'
  };
  const newsContainer = document.getElementById('news');

  let url =
    window.location.hostname === ('localhost' || 'cmda.github.io')
      ? feeds.local
      : feeds.cmdlo;

  console.log('hostname', window.location.hostname);
  console.log('url', url);

  fetch(url)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, 'text/xml'))
    .then(xml => {
      const data = xml2json(xml);
      const items = data.rss.channel.item;

      const newsItems = items
        .map(
          item => `
        <article>
          <header>
            <h1>${item.title}</h1>
            <a href="#" rel="author">${item.author}</a>
            <time>${item.pubDate.toString()}</time>
          </header>

          <p>${item.description}</p>

        </article>
      `
        )
        .join('');

      newsContainer.insertAdjacentHTML('afterend', newsItems);
    });
}
