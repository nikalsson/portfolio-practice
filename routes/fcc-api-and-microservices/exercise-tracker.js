const	mongoose	= require('mongoose');

// Set up the database variable and connect
const dBURL = process.env.DATABASEURL || 'mongodb://localhost:27017/portfolio-test' 
mongoose.connect(dBURL, { useNewUrlParser: true});

// API Project: Exercise Tracker
// First set up the user and exercise schemas, they are associated with each other

const Schema = mongoose.Schema
const userSchema = new Schema({
  username: String,
  exercises: [
    { // Associate Exercise from model with the user
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise"
    }
  ]
})

const exerciseSchema = new Schema({
  description: String,
  duration: Number,
  date: Date,
  author: {
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // refers to the model that is referred to with ObjectId above - User model
      },
      username: String,
    }
})

const User = mongoose.model('User', userSchema)
const Exercise = mongoose.model('Exercise', exerciseSchema)

// GET - Serve the form for adding users or exercies
getForm = (req, res) => {
  res.render('exercise-tracker');
}

// GET - Get an array of all the users
getAllUsers = async (req, res) => {
  try {
    User.find({}, (error, foundUsers) => {
      if(error) {
        res.json({"Error": error})
      }
      res.json(foundUsers)
    })
  }
  catch {
    res.json({"Error": error})
  }
}

// POST - Add a new user
postNewUser = async (req, res) => {
  // replace an HTTP posted body property with the sanitized string
  const username = req.sanitize(req.body.username);
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  if (username.length === 0) {
    res.json({error: "Username is too short!"})
  }
  // First try to find user with the given name, if not found --> create user
  try {
    let tryToCreate = await User.findOneAndUpdate({username: username}, options, (error, result) => {
      if (!error) {
        // If the user exists, return error
        if (result) {
          res.json({error: 'username already exists'})
        } 
        // If the user doesn't exist, create it and save to DB
        else {
          result = new User({username: username});
          result.save((error) => {
            if (!error) {
                res.json({'new user': result})
            } else {
                throw error;
            }
          })
        }
      } else {
        throw error;
      }
    })
  }
  catch {
    res.json({error: "Failed to create the user"});
  }
}

// POST - Add a new exercise for a user
postNewExercise = async (req, res) => {
  // replace an HTTP posted body property with the sanitized string
  const query = {username: req.sanitize(req.body.username)}
  const exerciseDate = (req.body.date) ? req.body.date : new Date(); // If the date is not given, use the day of posting
  const exerciseObject = {description: req.sanitize(req.body.description), duration: req.body.duration, date: exerciseDate}
  try {
    let tryToCreate = await User.findOne(query, (error, foundUser) => { // Find the user first
      if (error) { // Handle error or if user is not found
        res.json({error: error})
      } else if (foundUser === null) { 
        res.json({error: "User not found!"})
      }
      Exercise.create(exerciseObject, (error, createdExercise) => { // If all is well, create exercise
        if (error) {
          res.json({error: error})
        }
        // Add the author info to the created exercise and save the exercise to it's database and the reference to it to the user's data, save both
        createdExercise.author.id = foundUser._id;
        createdExercise.author.username = foundUser.username;
        createdExercise.save();
        foundUser.exercises.push(createdExercise);
        foundUser.save();
        res.json({Created: createdExercise});
      })
    })
  }
  catch {
    res.json({error: "Failed to create the exercise"});
  }
}

// GET - Exercises for a specific user, possibility of filtering by date, from, to & limit are not mandatory
// use the following syntax for filtering log/user&from=2010-01-01&to=2019-10-01&limit=20
getExercise = async (req, res) => {
  // Set default parameters for the query if user does not input them
  const username = req.params
  const fromDate = (req.query.from) ? new Date(req.query.from) : new Date('1900-01-01')
  const toDate = (req.query.to) ? new Date(req.query.to) : new Date('2100-01-01')
  const limit = (req.query.limit) ? req.query.limit : 10
  
  // First find the user based on the username, then find their exercises using populate, remove author, id and __v info using select, filter by date from, date to using match and limit the number of results 
  try {
    let tryToFind = await User.findOne(username)
      .populate({path: 'exercises', select: '-author -_id -__v', match: { date: { $gte: fromDate, $lte: toDate }}, options: {limit: limit}})
      .exec((error, foundPerson) => {
      if (error) {console.log(error)}
        else if (foundPerson === null) { 
          res.json({error: "User not found!"}) 
        }
        else {
          res.json({"Found exercises": foundPerson, "Exercise count": foundPerson.exercises.length})
        }
      })
  }
  catch {
    res.json({error: "Failed to find the user or exercise"});
  }
}

module.exports = {getForm, getAllUsers, postNewUser, postNewExercise, getExercise}

