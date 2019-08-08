// Load the modules to Node.js
const	express		= require('express'),
		mongoose	= require('mongoose'),
		app			= express(),
		Job			= require('./models/jobs'),
		Edu			= require('./models/education'),
		async		= require('async');

// App configuration
// Set the view engine to EJS 
app.set('view engine', 'ejs');
// Serve static files (such as images or CSS) from a directory 'public', built-in middleware function
app.use(express.static('public'));

var dBURL = process.env.DATABASEURL || 'mongodb://localhost:27017/portfolio'; // Set up a variable in case DATABASEURL environment gets messed up
// Connect mongoose module to MongoDB database, set in terminal (command export) - the address is therefore hidden and development & live dbs can be different
mongoose.connect(dBURL, { useNewUrlParser: true}); 

// passes moment to all routes with .locals for better handling of date
app.locals.moment = require("moment");

// Resume - show all jobs & education from DB
app.get('/', function(req, res){
	let locals = {};
	async.parallel(
		[
			// Load jobs data
			function(callback) {
				Job.find({}, function(err, allJobs){
					if (err) return callback(err);
					locals.allJobs = allJobs;
					callback();
				}).sort({dateStart: -1}); // use .sort() to sort the jobs from newest to oldest
			},
			// Load education data
			function(callback){
					Edu.find({}, function(err, allEdu){
					if (err) return callback(err);
					locals.allEdu = allEdu;
					callback();
				}).sort({dateStart: -1});
			}
		],
		function(err){ //Called after both tasks have called their callbacks
			if(err) return next(err);
			res.render('resume', {allJobs: locals.allJobs, allEdu: locals.allEdu});
		});			   
});

app.listen(process.env.PORT || 3030, function(){
    console.log('THE SERVER IS RUNNING');
});