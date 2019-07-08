var mongoose = require('mongoose');

// Mongoose schema config
let eduSchema = new mongoose.Schema({
    company: String,
    link: String,
    jobTitle: String,
    dateStart: {type: Date},
    dateEnd: {type: Date},
    location: String,
    description: String,
    certificate: String
});

// Export the model
module.exports = mongoose.model('Education', eduSchema);
