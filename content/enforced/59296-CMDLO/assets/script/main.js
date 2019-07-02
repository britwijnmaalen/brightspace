
/*
*
* Loosely based on:
*   - https://dev.to/shoupn/javascript-fetch-api-and-using-asyncawait-47mp
*   - https://dev.to/niinpatel/converting-xml-to-json-using-recursion-2k4j
*/


// https://dlo.mijnhva.nl/d2l/le/news/rss/59296/course?ou=59296
// http://www.hva.nl/faculteit/fdmci/nieuws/nieuwsoverzicht.rss


async function getFeedAsync(url) {
  return await fetch('https://cors-anywhere.herokuapp.com/'+url, {method: 'GET'})
}

async function parseFeedAsync(data) {
    console.log(data)
}

getFeedAsync(`https://dlo.mijnhva.nl/d2l/le/news/rss/59296/course?ou=59296`)
    .then(response => parseFeedAsync(response))