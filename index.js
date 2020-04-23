// global array  which will be populated with urls
var urls;


/**
 * onload function - parses json and calls helper to display new webpage
 */
addEventListener('fetch', event => {
  event.respondWith(new Promise((resolve, reject) => {

    // fetches json
    fetch('https://cfw-takehome.developers.workers.dev/api/variants')

      // grab json
      .then((res) => {
        return res.json()
      })

      //set to global variable
      .then(data => {
        urls = data.variants
        return data
      })

      //display new page
      .then(res => {

        if(res) {

          //generate random int - allows for variable json length
          let random = Math.floor((Math.random() * urls.length))
          resolve(handleRequest(urls[random], random))
        }

        //error handling
        else
          reject();
      })
    }));
  }
)
/**
 * Return a response with a random url
 * @param {Request} request the url to fetch
 */
async function handleRequest(request, random) {

  // must instantiate html rewriter
  const rewriter = new HTMLRewriter()
    .on('a', new ElementHandler('href', random))

  return new Promise((resolve, reject) => {
    fetch(request)
      .then((res) => {
        if(res)
          // changes the html of the page
          resolve(rewriter.transform(res))
        
        else
          reject();
      })
  })
}

// dictionary of html elements and wanted replacement values
const strings = {
  0: {
    href: 'https://dartmouth-cs52-20s.github.io/lab1-landingpage-rohithm1/',
    text: 'Check out Rohiths blog!'
  },
  1: {
    href: 'http://rohithmandavilli.me',
    text: 'Check out Rohiths personal website!'
  }
}


/**
 * Handles html changes
 */
class ElementHandler {

  /**
   * constructs/initializes the html rewriter object
   * @param random the index of the url that we are changing
   * @param attributeName the attributes we change
   */
  constructor(attributeName, random) {
    this.random = random
    this.attributeName = attributeName
  }

  /**
   * handles changing
   * @param element 
   */
  element(element) {

    // get the attributes to change
    const attribute = element.getAttribute(this.attributeName)
    const url = strings[this.random].href
    const text = strings[this.random].text

    // if exists, go ahead and set it to something different
    if (attribute) {
      element.setAttribute(this.attributeName, url)
      element.setInnerContent(text)
    }
  }
}
