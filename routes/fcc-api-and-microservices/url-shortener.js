const dns = require('dns'); // dns module needed in the URL shortener

let shortURLs = {1: "http://www.sodankyla.fi/Pages/Etusivu.aspx", 2: "https://luosto.fi/"}

// GET route for the input form and a list of shortened URLs
getForm = (req, res) => {
  errorMessage = null
  res.render('add-url', {shortURLs: shortURLs, errorMessage: errorMessage});
}

// GET route for shortcut URL, a hit redirects to the target page
// app.get('/api/shorturl/:url', (req, res) => {
getURL = (req, res) => {
  const urlIndex = req.params.url
  if (shortURLs[urlIndex]) {
    res.redirect(shortURLs[urlIndex])
  }
  
  else { // If the shortcut does not exist, display error and render add page
    errorMessage = `Shortcut #${urlIndex} does not exist`;
    res.render('add-url', {shortURLs: shortURLs, errorMessage: errorMessage});
  }
}

// POST route for adding new URLs to the list
// app.post('/api/shorturl/new', (req, res) => {
post = (req, res) => {
  try {
    if (/^http/.test(req.body.url)) { // Test if the given address starts with http
      let wwwAddress = req.body.url.split('//')[1].split('/')[0] // Get the address without https:// and without /xxx for dns module
      dns.lookup(wwwAddress, (error, address) => {
        if (address === undefined) { // dns.lookup does not recognize the accept -> invalid url
          errorMessage = 'Error: invalid URL, please try again';
          res.render('add-url', {shortURLs: shortURLs, errorMessage: errorMessage});
        } 

        else { // Add url to the URL KV pairs and re-load the page
          errorMessage = null;
          let urlIndex = Object.keys(shortURLs).length + 1;
          shortURLs[urlIndex] = req.body.url // Add the url to the shortURLs object
          res.render('add-url', {shortURLs: shortURLs, errorMessage: errorMessage}); // Re-render the add-url page to keep the list updated
        } 
      })  
    }
  
    else { // Address does not start with http -> invalid url
      errorMessage = 'Error: invalid URL, please try again';
      res.render('add-url', {shortURLs: shortURLs, errorMessage: errorMessage});
    }
  }
  catch { // If the address format is not proper, the split will fail and throw an error, catch it
    errorMessage = 'Error: invalid URL, please try again';
    res.render('add-url', {shortURLs: shortURLs, errorMessage: errorMessage});
  }
}

module.exports = {getForm, getURL, post}