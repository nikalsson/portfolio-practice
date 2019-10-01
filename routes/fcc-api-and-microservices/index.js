const	express		= require('express'),
      router  	= express.Router(),
      multer    = require('multer'); // middleware for handling multipart/form-data, which is primarily used for uploading files
      sanitizer = require('express-sanitizer'); // for mitigating against persistent XSS risks

const upload = multer(); // In case you omit the options object, the files will be kept in memory and never written to disk.
router.use(express.urlencoded({extended: true})); // Use express.urlencoded({extended: true}) to extract the body of a POST request
router.use(sanitizer()); // Mount the sanitizer middleware

router.get('/', (req, res) => {
  res.render('api-microservices-index');
})

// File Metadata Microservice
const fileMetadata = require('./file-metadata-microservice');
router.get('/file-metadata', fileMetadata.get);
router.post('/file-metadata', upload.single('upfile'), fileMetadata.post); // The POST handling logic is in another file

// URL Shortener Microservice -- simple, does not save the URLs to any DB
const shortURL = require('./url-shortener');
router.get('/shorturl', shortURL.getForm);
router.get('/shorturl/:url', shortURL.getURL); // Get redirected to the address of the original URL
router.post('/shorturl/new', shortURL.post); 

// Exercise Tracker - saves to mongoDB
const exerciseTracker = require('./exercise-tracker');
router.get('/exercise', exerciseTracker.getForm);
router.get('/exercise/users', exerciseTracker.getAllUsers); // List all users
router.get('/exercise/log/:username', exerciseTracker.getExercise); // Find a user and his exercises, use the following syntax for filtering log/user&from=2010-01-01&to=2019-10-01&limit=20
router.post('/exercise/new/user', exerciseTracker.postNewUser); // Create a new user
router.post('/exercise/new/exercise', exerciseTracker.postNewExercise); // Create a new exercise for a user

// Request Header Parser Microservice
router.get('/whoami', require('./request-header-parser'));

// Timestamp Microservice 
router.get("/timestamp/:date_string?", require('./timestamp'));

module.exports = router;