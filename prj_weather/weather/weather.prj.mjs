// Import all dependencies ========================================================================================================>
import axios from 'axios';
import cote from 'cote';
import 'dotenv/config';

// Logic ==========================================================================================================================>
const weatherService = new cote.Responder({ name: 'weather-service', namespace: 'weather' });
const key = process.env.WEA_API_KEY;

weatherService.on('getWeather', async (req, cb) => {
  try {
    console.log("Request received");
    const resp = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${req.params.body}&appid=${key}`);
    const filteredData = {
      city: req.params.body.charAt(0).toUpperCase() + req.params.body.slice(1).toLowerCase(), // Translate to multiple languages
      country: resp.data.sys.country,
      temp: Math.round(resp.data.main.temp - 273.15),
      weather: resp.data.weather[0].main
    }
    console.log("Request has been processed");
    cb({ state: resp.status, data: filteredData });
  } catch (e) { if (e.response && e.response.status) { cb({ state: e.response.status }) } else { cb({ state: 504 }) } };
});