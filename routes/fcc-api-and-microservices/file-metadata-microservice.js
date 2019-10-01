// POST for File Metadata Microservice

get = ('/file-metadata', (req, res) => { // Serve the file upload form
  res.render('file-metadata')
})

post = (async (req, res) => {
  const upfile = req.file;
  if (!upfile) { // If user did not select a file
    res.json({error: "No file was selected!"});
  } 
  
  // Display the information desired by freeCodeCamp task on successful upload
  else { 
    res.json({
      success: "The file was analyzed",
      filename: upfile.originalname,
      size: upfile.size
    })
  }
})

module.exports = {get, post}