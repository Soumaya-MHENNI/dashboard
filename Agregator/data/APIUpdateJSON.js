const http = require('http');
const https = require('https');
const fs = require('fs');
const parseString = require('xml2js').parseString;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;


//API irail.be

function iRailUpdate() {
    // http://api.irail.be/liveboard/?id=BE.NMBS.008812005&lang=fr&format=json
    const request = {
        "host": "api.irail.be",
        "port": 80,
        "path": "/liveboard/?id=BE.NMBS.008892007&lang=fr&format=json"
        };

    http.get(request, receiveResponseCallbackiRail);

    function receiveResponseCallbackiRail(response) {
        let rawData = "";
        response.on('data', (chunk) => { rawData += chunk; }); 
        response.on('end', function() { 
            let iRail = JSON.parse(rawData);
            let stringToSave = JSON.stringify(iRail, null, 4);
            fs.writeFile("iRail.json", stringToSave, (err)=>{
                if(err) console.log(err);
                else console.log('iRail.json saved');
            });
        });
    }
}

//API air Quality

function airQualityUpdate() {
    // https://air-quality-api.open-meteo.com/v1/air-quality?latitude=52.5235&longitude=13.4115&hourly=pm10,pm2_5
    const request = {
        "host": "air-quality-api.open-meteo.com", 
        "port": 443,
        "path": "/v1/air-quality?latitude=52.5235&longitude=13.4115&hourly=pm10,pm2_5"
        };

    https.get(request, receiveResponseCallbackAirQuality);

    function receiveResponseCallbackAirQuality(response) {
        let rawData = "";
        response.on('data', (chunk) => { rawData += chunk; });
        response.on('end', function() { 
            let airQuality = JSON.parse(rawData);
            let stringToSave = JSON.stringify(airQuality, null, 4);
            fs.writeFile(   'airQuality.json',
                            stringToSave,
                            function (err) {
                                if (err) console.log(err);
                                else console.log("airQuality.json saved");
                                }
                        );
        });
    }
}

//API floatrates

function floatRatesUpdate(){
    // http://www.floatrates.com/daily/eur.json
    const request = {
        "host": "www.floatrates.com",
        "port": 80,
        "path": "/daily/eur.json"
        };
    
    http.get(request, receiveResponseCallback);

    function receiveResponseCallback(response) {
        let rawData = "";
        response.on('data', (chunk) => { rawData += chunk; }); 
        response.on('end', function() { 
            let floatRates = JSON.parse(rawData);
            let floatRatesArray=[]
            for ( const [key ,value] of Object.entries(floatRates)){
                let floatTemp =value;
                floatTemp.alphaCode =key;
                 floatRatesArray.push(floatTemp);
            }

            let stringToSave = JSON.stringify(floatRatesArray, null, 4);
            fs.writeFile("FloatRates.json", stringToSave, (err)=>{
                if(err) console.log(err);
                else console.log('FloatRates.json saved');
            });
        });
       }
}

//API open-meteo for weatherForecast

function weatherForecastUpdate(){
    // https://api.open-meteo.com/v1/forecast?latitude=50.85&longitude=4.35&hourly=temperature_2m
    let request = {
        "host": "api.open-meteo.com", 
        "port": 443,
        "path": "/v1/forecast?latitude=50.85&longitude=4.35&hourly=temperature_2m"
        };
    
        
    function receiveResponseCallback(response) {
        let rawData = ""; 
        response.on('data', (chunk) => { rawData += chunk; });
        response.on('end', function() { 
            // console.log(rawData);
            let weatherForecast = JSON.parse(rawData);
            // console.log(weatherForecast.hourly.temperature_2m[10]);
            let stringToSave = JSON.stringify(weatherForecast, null, 4);
            fs.writeFile(   'weatherForecast.json',
                            stringToSave,
                            function (err) {
                                if (err) console.log(err);
                                else console.log("WeatherForecast.json saved");
                                }
                        );
        });
    }

    https.get(request, receiveResponseCallback);
}

//RSS Le monde
function rssLemondeUpdate(){
    let request = {
        "host": "www.lemonde.fr",
        "port": 443,
        "path": "/musiques/rss_full.xml"
    }; 

    function receiveResponseCallback(response) {
        let rawData = "";
        response.on('data', (chunk) =>{ rawData += chunk; }); 
        response.on('end', function(){ 
            parseString(rawData, function (err, rssJson){ 
                let stringToSave = JSON.stringify(rssJson, null, 4);
                fs.writeFile('musiqueLeMonde.json', stringToSave,           
                function (err) {
                    if (err){
                        console.log(err);
                    }else {
                        console.log("RSS Le Monde saved");
                    };
                });
            });
        });
    }

    https.get(request,receiveResponseCallback);
}

//Agenda Concerts with html 

function htmlConcertsUpdate(){
    //https://www.koolstrings.net/agenda.php
    const request = {
        "host": "www.koolstrings.net",
        "port": 443,
        "path": "/agenda.php"
    };

    function receiveResponseCallback(response) {
        let rawData = "";
        response.on('data', (chunk) => { rawData += chunk; });
        response.on('end', function () {
            const dom = new JSDOM(rawData);
            const domConcerts = dom.window.document.children[0].children[1].children[0].children[5].children[0];
            let concertArray = [];
            for (let i = 7; i < domConcerts.children.length; i++) {
                if (domConcerts.children[i].children.length === 5) {
                    let concert = new Object();
                    concert.date =domConcerts.children[i].children[0].innerHTML;
                    concert.artiste=domConcerts.children[i].children[2].innerHTML;
                    //concert.href=domConcerts.children[i].children[4].children[0].href;
                    concert.salle=domConcerts.children[i].children[4].textContent;
                    concertArray.push(concert)
                }
            }
            let stringToSave = JSON.stringify(concertArray, null, 4);
            fs.writeFile("concert.json", stringToSave, (err) => {
                if (err) console.log(err);
                else console.log('Concerts saved');
            });
        });
    }

    https.get(request, receiveResponseCallback);
}


//API Horoscope

function horoscopeUpdate(){
    const request = require('request');

    let signs = [
        'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra',
        'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
    ];

    let horoscopeObject = new Object();
    let counter =0;

    for(let i=0; i<signs.length; i++){
        let options = {
            url: 'https://aztro.sameerkumar.website/?sign=' + signs[i] + '&day=today',
            method: 'POST'
        };
    
        request(options, callback);
    
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                let horoscope = JSON.parse(body);
                horoscopeObject[signs[i]] = horoscope;
           counter++;
                if (counter === 12) {
                    let stringToSave = JSON.stringify (horoscopeObject, null, 4);
                    fs.writeFile("horoscope.json", stringToSave, (err) => {
                        if (err) console.log(err);
                        else console.log('Horoscope saved');
                    });
                }
            }
        }
    }
}

function horoscopeUpdate1(){
    const request = require('request');

    let signs = [
        'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra',
        'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
    ];

    let horoscopeArray = [];

    for(let i=0; i<signs.length; i++){
        let options = {
            url: 'https://aztro.sameerkumar.website/?sign=' + signs[i] + '&day=today',
            method: 'POST'
        };
    
        request(options, callback);
    
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                let horoscope = JSON.parse(body);
                horoscope.sign = signs[i];
                horoscopeArray.push(horoscope);
                if (horoscopeArray.length===12) {
                    let stringToSave = JSON.stringify(horoscopeArray, null, 4);
                    fs.writeFile("horoscope1.json", stringToSave, (err) => {
                        if (err) console.log(err);
                        else console.log('Horoscope saved');
                    });
                }
            }
        }
    }
}

//call functions
 
horoscopeUpdate1();
horoscopeUpdate();
iRailUpdate();
airQualityUpdate();
floatRatesUpdate();
weatherForecastUpdate();
rssLemondeUpdate();
htmlConcertsUpdate();

setInterval(iRailUpdate, 60000);
setInterval(rssLemondeUpdate, 60000*60);
setInterval(airQualityUpdate, 60000*60*24);
setInterval(floatRatesUpdate, 60000*60*24);
setInterval(weatherForecastUpdate, 60000*60*24);
setInterval(htmlConcertsUpdate, 60000*60*24);
