// Load the modules to Node.js
const	express		= require('express'),
		mongoose	= require('mongoose'),
		app			= express(),
		Job			= require('./models/jobs'),
		Edu			= require('./models/education'),
		// seedDB		= require('./seeds'),
		async		= require('async');

// dotenv for hiding the address of the database
require('dotenv').config();


// App configuration
// Set the view engine to EJS 
app.set('view engine', 'ejs');
// Serve static files (such as images or CSS) from a directory 'public', built-in middleware function
app.use(express.static('public'));
// Connect the mongoose module to a mLab database
mongoose.connect(process.env.DATABASEADDRESS, { useNewUrlParser: true});
//'mongodb://localhost:27017/portfolio' FOR LOCAL DB

// seedDB(); // Seed the database with new information

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
				}).sort({_id: 1}); // use .sort() to sort the database by IDs
			},
			// Load education data
			function(callback){
					Edu.find({}, function(err, allEdu){
					if (err) return callback(err);
					locals.allEdu = allEdu;
					callback();
				}).sort({_id: 1});
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