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

  handleNews();
  enhanceUI();

  // fetch, parse en render rss news feed
  function handleNews() {
    if (document.body.contains($('#news'))) {
      getNews();
    }

    // does way to much... but it works!
    function getNews() {
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
          let news = '';

          if (!items.length) {
            news = template(items);
          } else {
            news = items
              .map(item => {
                return template(item);
              })
              .reverse()
              .join('');
          }

          newsContainer.insertAdjacentHTML('afterend', news);
        });
    }

    /**
     * This function returns a rendered item
     * @param item: item to render
     */
    function template(item) {
      return `
        <article>
          <header>
            <h1>${item.title}</h1>
            <time>${convertDate(item.pubDate)}</time>

          </header>

          <p>${stripHTML(item.description)}</p>

        </article>
      `;
    }
    /**
     * This function strips HTML elements from string
     * @param str: string to strip
     */
    function stripHTML(str) {
      const doc = new DOMParser().parseFromString(str, 'text/html');
      return doc.body.textContent || '';
    }

    /**
     * This function converts a date into Intl.DateTimeFormat
     * @param date: date to convert
     */
    function convertDate(date) {
      return new Intl.DateTimeFormat().format(new Date(date));
    }
  }

  // enhance UI
  function enhanceUI() {
    skipSubNav();
    scrollToInlineNav();
    scrollToNav();

    /**
     * This function makes it possible to scroll past the sub navigation
     *
     */
    function skipSubNav() {
      const onPageNav = $('main header > nav');
      if (document.body.contains(onPageNav)) {
        const target = $('main header + *');
        setTimeout(scrollToContent(target), 2000);
      }
    }

    /**
     * This function makes it possible to scroll to the inline page navigation
     *
     */
    function scrollToInlineNav() {
      const toInlineNav = $$('main article > a');
      if (document.body.contains(toInlineNav[0])) {
        const inlineNav = $('main > nav');
        toInlineNav.forEach(link => {
          link.addEventListener('click', e => {
            e.preventDefault();
            setTimeout(scrollToContent(inlineNav), 100);
          });
        });
      }
    }

    /**
     * This function creates a link making it possible to scroll to the main navigation
     *
     */
    function scrollToNav() {
      let scrollToLink = createElement('a');
      setInnerHTML(scrollToLink, 'Navigatie');
      scrollToLink.classList.add('to-navigation', 'highlight');
      scrollToLink.addEventListener('click', e => {
        e.preventDefault();
        const nav = $('body > nav');
        setTimeout(scrollToContent(nav), 100);
      });
      append(scrollToLink, 'main > header');
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
      $(parent).appendChild(element);
    }

    /**
     * Scroll to content
     * @param target: the element to scroll to
     */
    function scrollToContent(target) {
      return function() {
        target.scrollIntoView({ behavior: 'smooth' });
      };
    }
  }

  // helper functions
  function $(el) {
    return document.querySelector(el);
  }
  function $$(els) {
    return document.querySelectorAll(els);
  }
})(); // the dogs balls
