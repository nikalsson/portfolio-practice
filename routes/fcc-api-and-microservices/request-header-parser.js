// API Project: Request Header Parser Microservice
module.exports = (req, res) => {
  // Client IP from headers X-Forwarded-For: client, proxy1, proxy2 -- get the first address using split()
  try {
    const ipaddress = req.headers['x-forwarded-for'.split(',')[0]] || req.connection.remoteAddress;
    const language = req.headers['accept-language'];
    const software = req.headers['user-agent'];
    const returnJSON = {"ipaddress": ipaddress, "language": language, "software": software};
    res.json(returnJSON);
  }
  catch {
    res.json({error: "Unknown error"});
  }
}