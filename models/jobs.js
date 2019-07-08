var mongoose = require('mongoose');

// Mongoose schema config
let jobSchema = new mongoose.Schema({
    company: String,
    link: String,
    jobTitle: String,
    dateStart: {type: Date},
    dateEnd: {type: Date},
    location: String,
    description: String,
});

// Export the model
module.exports = mongoose.model('Job', jobSchema);