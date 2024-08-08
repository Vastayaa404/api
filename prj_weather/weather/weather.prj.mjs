import axios from 'axios';
import cote from 'cote';

const weatherService = new cote.Responder({ name: 'weather-service', namespace: 'weather' });

weatherService.on('getWeather', async (body, cb) => {
  try {
    const resp = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${body.body}&appid=`);
    const filteredData = {
      city: body.body.charAt(0).toUpperCase() + body.body.slice(1).toLowerCase(), // Translate to multiple languages
      country: resp.data.sys.country,
      temp: Math.round(resp.data.main.temp - 273.15),
      weather: resp.data.weather[0].main
    }
    cb({ state: resp.status, data: filteredData });
  } catch (e) { if (e.response && e.response.status) { cb({ state: e.response.status }) } else { cb({ state: 504 }) } };
});