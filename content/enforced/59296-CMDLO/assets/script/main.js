/*
*
* Loosely based on:
*   - https://dev.to/shoupn/javascript-fetch-api-and-using-asyncawait-47mp
*   - https://dev.to/niinpatel/converting-xml-to-json-using-recursion-2k4j
*   -
*/
(() => {
  toggleNav();

  if (document.body.contains(document.getElementById('news'))) {
    getNews();
  }

  function getNews() {
    const feeds = {
      cmdlo: 'https://dlo.mijnhva.nl/d2l/le/news/rss/59296/course?ou=59296',
      fdmci: 'http://www.hva.nl/faculteit/fdmci/nieuws/nieuwsoverzicht.rss',
      proxy: 'https://cors-anywhere.herokuapp.com/',
      local: './assets/script/rss.xml'
    };
    const newsContainer = document.getElementById('news');

    let url =
      window.location.hostname === 'cmda.github.io' ||
      window.location.hostname === 'localhost'
        ? feeds.local
        : feeds.cmdlo;

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
            <time>${convertDate(item.pubDate)}</time>

            <a href="#" rel="author">${item.author}</a>

          </header>

          <p>${item.description}</p>

        </article>
      `
          )
          .join('');

        newsContainer.insertAdjacentHTML('afterend', newsItems);
      });
  }

  function convertDate(date) {
    return new Intl.DateTimeFormat().format(new Date(date));
  }

  function toggleNav() {
    const body = document.body;
    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = 'toggle menu';

    toggleBtn.addEventListener('click', e =>
      body.classList.toggle('hide-menu')
    );
    document.body.appendChild(toggleBtn);
  }
})();
