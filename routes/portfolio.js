const	express		= require('express'),
			router  	= express.Router()
			app				= express(),
			Job				= require('../models/jobs'),
			Edu				= require('../models/education'),
			async			= require('async');

// Resume - show all jobs & education from DB
router.get('/', (req, res) => {
  try {
    let locals = {};
    async.parallel(
      [
        // Load jobs data
        (callback) =>  {
          Job.find({}, (err, allJobs) => {
            if (err) return callback(err);
            locals.allJobs = allJobs;
            callback();
          }).sort({dateStart: -1}); // use .sort() to sort the jobs from newest to oldest
        },
        // Load education data
        (callback) => {
            Edu.find({}, (err, allEdu) => {
            if (err) return callback(err);
            locals.allEdu = allEdu;
            callback();
          }).sort({dateStart: -1});
        }
      ],
      (err) => { //Called after both tasks have called their callbacks
        if(err) return next(err);
        res.render('resume', {allJobs: locals.allJobs, allEdu: locals.allEdu});
      });			   
    }

    catch { // In case of failing to fetch data from DB, show these placeholders
      let locals = {
        "allJobs": [{"company": "Error fetching data from the database", "dateStart": new Date(), "dateEnd": new Date(), "link": "", "jobTitle": "", "location": "", "description": ""}], 
        "allEdu": [{"company": "Error fetching data from the database", "dateStart": new Date(), "dateEnd": new Date(), "link": "", "jobTitle": "", "location": "", "description": ""}]
      }
      res.render('resume', {allJobs: locals.allJobs, allEdu: locals.allEdu});
    }
});

module.exports = router;