/*
* TODO: Strive for monads only (https://curiosity-driven.org/monads-in-javascript)
*
* Not at all based on:
*   - https://dev.to/shoupn/javascript-fetch-api-and-using-asyncawait-47mp
*   - https://dev.to/niinpatel/converting-xml-to-json-using-recursion-2k4j
*   -
*/
(() => {
  // define constants
  const feeds = {
    cmdlo: 'https://dlo.mijnhva.nl/d2l/le/news/rss/59296/course?ou=59296',
    fdmci: 'http://www.hva.nl/faculteit/fdmci/nieuws/nieuwsoverzicht.rss',
    proxy: 'https://cors-anywhere.herokuapp.com/',
    local: './assets/script/rss.xml'
  };

  // disable menu toggle for now, improve later
  //toggleNav()

  // create another script that we only include in index?
  if (document.body.contains(document.getElementById('news'))) {
    getNews();
  }

  // does way to much... but it works!
  function getNews() {
    const newsContainer = document.getElementById('news');
    let url =
      window.location.hostname === 'cmda.github.io' ||
      window.location.hostname === 'localhost'
        ? feeds.local
        : feeds.fdmci;

    fetch(feeds.proxy + url)
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

  /**
   * This function converts a date into Intl.DateTimeFormat
   * @param date: date to convert
   */
  function convertDate(date) {
    return new Intl.DateTimeFormat().format(new Date(date));
  }

  /**
   * This function creates a button to toggle the navigation using a CSS
   * class juggling event listener toggling the 'hide-menu' class.
   *
   * DOES TOO MUCH, REFACTOR!
   */
  function toggleNav() {
    let toggleBtn = createElement('button');
    setInnerHTML(toggleBtn, 'toggle menu');
    toggleBtn.addEventListener('click', e =>
      document.body.classList.toggle('hide-menu')
    );
    append(toggleBtn, 'nav');
  }

  /**
   * This function changes the innerHTML for the passed element
   * @param element: the element to change the inner HTML for
   * @param innerHTML: the stuff that goes in to the inner HTML
   */
  function setInnerHTML(element, innerHTML) {
    element.innerHTML = innerHTML;
  }

  /**
   * Creates an element and returns it
   */
  function createElement(element) {
    return document.createElement(element);
  }

  /**
   * Appends a HTML element to a parent
   * @param element: the element to append
   * @param parent : the parent to append to
   */
  function append(element, parent) {
    document.querySelector(parent).appendChild(element);
  }
})(); // the dogs balls
