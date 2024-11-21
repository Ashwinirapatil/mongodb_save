

const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware to parse JSON data in requests
app.use(express.json());

// MongoDB Atlas connection string
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://ashwinirapatil19:F%24Z%24PYYH%25%242Hg5t@clusteruser.eycl6.mongodb.net/?retryWrites=true&w=majority&appName=Clusteruser';

// Connect to MongoDB Atlas
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err);
    process.exit(1); // Exit if unable to connect
  });

// Define a Mongoose schema and model
const datasSchema = new mongoose.Schema({
  timestamp: { type: Date, required: false },
  unitConsumption: { type: Number, required: false}
});
const DataModel = mongoose.model('UserData', datasSchema);
/*
const UserSchema = new mongoose.Schema({
  clerkId: {
     type:String,
     required:true,
     unique: true,
  },
  email: {
   type:String,
   required:true,
   unique:true,
  },
  username:{
   type:String,
   unique:true,
  },
  firstName: {
   type:String,
  },
  lastName:{
   type:String,
  },
});

const DataModel = mongoose.model('User', UserSchema);
*/

// Route to store JSON data from a file into MongoDB
app.post('/store-json', async (req, res) => {
  try {
    // Read JSON data from the file
    const jsonData = fs.readFileSync('data.json', 'utf8');
    const data = JSON.parse(jsonData);
    console.log("Data to be saved:", data);


    if (!Array.isArray(data) || data.length === 0) {
      console.log("Invalid or empty data");
      return res.status(400).send('Invalid or empty JSON data');
    }

    // Insert the JSON data into MongoDB
    await DataModel.insertMany(data);
    return res.status(200).send('Data successfully stored in MongoDB');
  } catch (err) {
    console.error('Error storing data:', err);
    // if (!res.headersSent) {
    //   return res.status(500).send('Error storing data in MongoDB');
    // }
  }
});

app.get('/consumption', async (req, res) => {
  const { days } = req.query; // Get 'days' from query parameter
  const numDays = parseInt(days, 10) || 1; // Default to 1 day if not specified

  try {
      const data = await fetchDataByDays(numDays);
      res.json({ data });
  } catch (error) {
      res.status(500).json({ error: 'Error fetching consumption data' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


