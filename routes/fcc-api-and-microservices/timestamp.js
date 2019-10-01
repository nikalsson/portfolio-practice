// API Project: Timestamp Microservice 
module.exports = (req, res) => {
  const userInput = req.params.date_string
  const unixDate = new RegExp('^\\d+$'); // Match Unix date in numbers
  const ISODate = new RegExp(/^(\d{4})-(\d{1,2})-(\d{1,2})/) // Match YYYY-MM-DD and YYYY-M-D
  
  let returnJSON = {"unix": null, "utc" : "Invalid Date" }
  
  if ( unixDate.test(userInput) || ISODate.test(userInput)){
    if (!userInput) {
      res.json({"unix": null, "utc" : "Invalid Date" })
    }

    // If the date is in unix format, convert to a number with parseInt
    let date = (unixDate.test(userInput)) ? new Date(parseInt(userInput)) : new Date(userInput);

    // If the date is in ISO format but incorrect, do not change the returnJSON
    if (typeof date === 'object' && new Date(date) == "Invalid Date") {
      null
    } 
    
    // If the date string is valid the api returns a JSON having the following structure
    else {
      returnJSON = {
        "unix": date.getTime(),
        "utc" : date.toUTCString()
      }  
    }
  }
  
  res.json(returnJSON);
};