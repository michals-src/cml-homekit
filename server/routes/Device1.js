//Dependencies
const router        = require('express').Router();
const firebase      = require('firebase');
const schedule      = require('node-schedule');
const axios         = require('axios');

//const host_dev      = 'http://localhost:9000';
const host_dev    = 'https://srv-homekit-cml.herokuapp.com';

//global Rule
let DateTime = new Date(Date.now() + 300000);
let gRule = new schedule.RecurrenceRule();
gRule.hour = DateTime.toLocaleTimeString('pl-PL', {hour: 'numeric'});
gRule.minute = DateTime.toLocaleTimeString('pl-PL', {minute: 'numeric'});

//Checking device signal while server is starting
firebase.database().ref('options/state').once('value', (data) => {
    let deviceState = data.val();

    if( 1 === deviceState ){
        info('Force stopped signal due to lose turn off time.');
        changedeviceState(0);
    }
});


let retrieveTime = () => {
    var today = new Date();
    let currentDateTime = [];
    currentDateTime.push(today.toLocaleDateString('pl-PL', {year: 'numeric', month: 'numeric', day: 'numeric'}).split('.').join('/'));
    currentDateTime.push(today.toLocaleTimeString());

    return currentDateTime.join(' ');
};

let info = (msg) => {
    console.log(retrieveTime(), ":", msg);
};


let onKeepingWake = {
    job: null,
    start: () => {
        onKeepingWake.job = schedule.scheduleJob('*/20 * * * *', function(e){
            //Conversation with self 
            axios.get(host_dev + '/onnosleep')
            .then(res => {
                info("onKeeping(): Hello there !");
            })
            .catch( err => {
                info("onKeeping(): Promise missed.");
            });
        });
    },
    stop: () => {
        if( onKeepingWake.job ){
            onKeepingWake.job.cancel();
            onKeepingWake.job = null;
            info("onKeepingWake() stopped");
        }
        return true;
    }
};


router.route('/signal').get((req, res) => {
    let response = {
        brightness: 0
    };

    response.reccurenceRule = gRule;

    firebase.database().ref('options/brightness').once('value', (data) => {
        response.brightness = data.val();

       // firebase.database().ref('options/power').once('value', (data) => {
            //response.power = data.val();

            res.json(response);
            info('New client: Getting signal information');

        //});
    });

});

let job;
let changedeviceState = (deviceState) => {
    firebase.database().ref('options/state').set(deviceState, err => {
        if( err ){
            info('Signal changing error occurred.');
        }else{
            info('Signal status changed.');
        }
    });
};

router.route('/power').post((req,res) => {
    let devicePower = req.body.intensity;
    firebase.database().ref('options/power').set(devicePower, err => {
        res.status(200);
        res.send('');
    });
});

router.route('/signal').post((req,res) => {
    let deviceBrightness = req.body.brightness;
    let deviceTimeOff = req.body.time;
    
    //let deviceTimeOff = req.body.time.split(':');


    if( deviceBrightness === 0 ){
        if(job){
            job.cancel();
            console.log('Force cancel job.');
            job = false;
        }
        onKeepingWake.stop();
    }

    if( deviceBrightness > 0 && ! job ){
        var rule = new schedule.RecurrenceRule();
        gRule.hour = rule.hour = deviceTimeOff.hour;
        gRule.minute = rule.minute = deviceTimeOff.minute;

        console.log('Hour: ' + rule.hour, 'Minute: ' + rule.minute );

        job = schedule.scheduleJob(rule, function(){
            
            // Device signal turn to 0 -> wyłączenie ledów
            // Cancel schedule job -> ledy się wyłączyły, nie trzeba już monitorować 
            // Camcel onKeepingMachine -> ledy wyłączone, nie podtrzymuje aktywności
            firebase.database().ref('options/brightness').set(0, err => {});
            job.cancel();
            onKeepingWake.stop();

            info('Job is finished.');

        });

        onKeepingWake.start();
    }

    firebase.database().ref('options/brightness').set(deviceBrightness, err => {});


    // if(1 === deviceState){

    //     var rule = new schedule.RecurrenceRule();
    //     gRule.hour = rule.hour = deviceOffTime[0];
    //     gRule.minute = rule.minute = deviceOffTime[1];

    //     console.log('Hour: ' + rule.hour, 'Minute: ' + rule.minute );

    //     job = schedule.scheduleJob(rule, function(){
            
    //         // Device signal turn to 0 -> wyłączenie ledów
    //         // Cancel schedule job -> ledy się wyłączyły, nie trzeba już monitorować 
    //         // Camcel onKeepingMachine -> ledy wyłączone, nie podtrzymuje aktywności
    //         changedeviceState(0);
    //         job.cancel();
    //         onKeepingWake.stop();

    //         info('Job is finished.');

    //     });

    //     onKeepingWake.start();

    // }else{
    //     if(job){
    //         job.cancel();
    //         console.log('Force cancel job.');
    //     }
    //     onKeepingWake.stop();
    // }

    res.sendStatus(200);
    //changedeviceState(deviceState);
    // firebase.database().ref('device1').set({signal: deviceState }, err => {
    //     if( err ){
    //         info('Signal chaning error occurred.');
    //     }else{
    //         res.sendStatus(200);
    //         info('Signal status changed.');
    //     }
    // });



});

module.exports = router;