let express = require('express');
let fs = require('fs');
let app = express();
app.use('/', express.static(__dirname + "/assets"));
app.set('view engine', 'ejs');

//Read json files
let fileContentTemplateWeather = fs.readFileSync('./data/weatherForecast.json');
let fileContentTemplateAirQuality = fs.readFileSync('./data/airQuality.json');
let fileContentTemplateRates = fs.readFileSync('./data/FloatRates.json');
let fileContentTemplateConcerts = fs.readFileSync('./data/concert.json');
let fileContentTemplateLeMonde = fs.readFileSync('./data/musiqueLeMonde.json');
let fileContentTemplateIrail = fs.readFileSync('./data/iRail.json');
let fileContentTemplateHoroscope = fs.readFileSync('./data/horoscope.json');
let fileContentTemplateHoroscope1 = fs.readFileSync('./data/horoscope1.json');
//parses a JSON 
let meteoAPI = JSON.parse(fileContentTemplateWeather);
let meteoAirQuality = JSON.parse(fileContentTemplateAirQuality);
let ApiRates = JSON.parse(fileContentTemplateRates);
let ApiConcert = JSON.parse(fileContentTemplateConcerts);
let ApiLeMonde = JSON.parse(fileContentTemplateLeMonde);
let ApiIRail = JSON.parse(fileContentTemplateIrail);
let ApiHoroscope = JSON.parse(fileContentTemplateHoroscope);
let ApiHoroscope1 = JSON.parse(fileContentTemplateHoroscope1);


let temperatures = meteoAPI.hourly.temperature_2m;
let meteoAirQualitys = meteoAirQuality.hourly.pm10;


// Create serveur, listening port  

app.listen(8000, function () {
    console.log('Server running at http://127.0.0.1:8000/');
    console.log('Listening on port 8000');
});




let date = new Date(meteoAPI.hourly.time[16])
let now = new Date();
let nowHour = now.getHours();
let nowTemperature = temperatures[nowHour];
let nowAirQuality = meteoAirQualitys[nowHour];

// data fusion with The template  index.ejs
app.get('/', function (request, response) {
    response.setHeader('Content-Type', 'text/html');
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

    let dataToJS = {

        date: date.toLocaleDateString('fr-FR', options),
        time: now.toLocaleTimeString(),
        nowTemperature: nowTemperature,
        AirQuality: nowAirQuality,
        RateUSD: (ApiRates[0].rate).toFixed(2),
        INVRateUSD: (ApiRates[0].inverseRate).toFixed(2),
        concerts: ApiConcert,
        niews: ApiLeMonde.rss.channel[0].item,
        Irail: ApiIRail.departures.departure,
        IrailStattionName: ApiIRail.station,
        Horoscope: ApiHoroscope.pisces



    }

    response.render('index.ejs', dataToJS)
});

// data fusion with The template irail.ejs

app.get('/liveboardGare', function (request, response) {
    response.setHeader('Content-Type', 'text/html');
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    let dataToJS = {

        date: date.toLocaleDateString('fr-FR', options),
        time: now.toLocaleTimeString(),
        Irail: ApiIRail.departures.departure,
        IrailStattionName: ApiIRail.station,

    }

    response.render('irail.ejs', dataToJS)
});


// data fusion with The template actuality.ejs

app.get('/Actuality', function (request, response) {
    response.setHeader('Content-Type', 'text/html');
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    let dataToJS = {

        date: date.toLocaleDateString('fr-FR', options),
        time: now.toLocaleTimeString(),

        niews: ApiLeMonde.rss.channel[0].item,
    }

    response.render('actuality.ejs', dataToJS)
});

// data fusion with The template rate.ejs

app.get('/FloatRates', function (request, response) {

    response.setHeader('Content-Type', 'text/html');


    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    let dataToJS = {

        date: date.toLocaleDateString('fr-FR', options),
        time: now.toLocaleTimeString(),
        Rate: ApiRates


    }

    response.render('rate.ejs', dataToJS)
});

// data fusion with The template Horoscope.ejs

app.get('/Horoscope', function (request, response) {

    response.setHeader('Content-Type', 'text/html');


    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    let dataToJS = {

        date: date.toLocaleDateString('fr-FR', options),
        time: now.toLocaleTimeString(),
        Horoscope1: ApiHoroscope1


    }

    response.render('horoscope.ejs', dataToJS)
});