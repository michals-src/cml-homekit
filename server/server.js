const express = require('express');
const cors = require('cors');
const schedule = require('node-schedule');
const firebase = require('firebase');
const axios = require('axios');


const host_dev      = 'http://localhost:9000';
const host_build    = 'https://cml-homekit-server.herokuapp.com';

/**
 * TODO
 * 
 * // Zmienjszenie pobierania godzin dynnos
 * onNoSleep utrzymuje przytomność tylko, gdy ledy się świecą
 * w innym przypadku jeżeli zostanie uśpiony, wejście na clienta, go obudzi
 * 
 * 
 */


//const mongoose = require('mongoose');

//require('dotenv').config();

const app = express();
const port = process.env.PORT || 9000;


var config = {
    apiKey: "OAsIG0Zqk5bCETBUG0iwDsvjj7LLRAO37Ay1Rd1i",
    databaseURL: "https://cml-homekit.firebaseio.com/",
};
firebase.initializeApp(config);

app.use(cors());
app.use(express.json());

//const uri = process.env.ATLAS_URI;
// mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true }
// );
// const connection = mongoose.connection;
// connection.once('open', () => {
//   console.log("MongoDB database connection established successfully");
// })

// const exercisesRouter = require('./routes/exercises');
// const usersRouter = require('./routes/users');

// app.use('/exercises', exercisesRouter);
// app.use('/users', usersRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

app.get('/onnosleep', (req, res) => {
    res.json({onEvent: 'Hello there !'});
});

app.get('/', (req, res) => {
    console.log('htttp client');
    res.sendStatus(200);
});

const Device1 = require('./routes/Device1');
app.use('/device', Device1);

//Żeby nie usypiało po 30 min.
// var onNoSleep = schedule.scheduleJob({rule: '*/20 * * * *'}, function(){
//     var time = new Date(Date.now());
//     axios.get(host_dev + '/onnosleep')
//     .then(res => {
//         console.log(time.toLocaleTimeString('pl-PL'), " onNoSleep(): Hello there !");
//     })
//     .catch( err => {
//         console.log(time.toLocaleTimeString('pl-PL'), ' I am going to sleep ...');
//     });
// });

