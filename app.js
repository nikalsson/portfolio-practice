// Load the modules to Node.js
const	express		= require('express'),
			mongoose	= require('mongoose'),
			app				= express();

// Load the routes
const	portfolioRoute		= require('./routes/portfolio'),
			fccAPIroute				= require('./routes/fcc-api-and-microservices/index');


// App configuration
// Set the view engine to EJS 
app.set('view engine', 'ejs');
app.use(express.static('public')); // Serve static files (such as images or CSS) from a directory 'public', built-in middleware function

const dBURL = process.env.DATABASEURL || 'mongodb://localhost:27017/portfolio-test'; // Set up a variable in case DATABASEURL environment gets messed up
// Connect mongoose module to MongoDB database, set in terminal (command export) - the address is therefore hidden and development & live dbs can be different
mongoose.connect(dBURL, { useNewUrlParser: true}); 

// passes moment to all routes with .locals for better handling of date
app.locals.moment = require("moment");

// Serve static files in public folder, needed to serve Corealate certificate picture and have a reference for the database item
app.use(express.static('public'))

app.use('/', portfolioRoute);
app.use('/apis-and-microservices', fccAPIroute);

app.listen(process.env.PORT || 3030, function(){
    console.log('THE SERVER IS RUNNING');
});