// Import all dependencies ======================================================================================================================================================================================================>
import axios from 'axios';
import cote from 'cote';
import 'dotenv/config';
import redis from '../../db_redis/models/index.mjs';

// Module =======================================================================================================================================================================================================================>
const weatherService = new cote.Responder({ name: 'weather-service', namespace: 'weather' });
const key = process.env.WEA_API_KEY;

weatherService.on('getWeather', async (req, cb) => {
  try {
    const cacheKey = `weather:${req.params.body}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) return cb({ state: 304, data: JSON.parse(cachedData) });

    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${req.params.body}&appid=${key}`);
    const filteredData = {
      city: req.params.body.charAt(0).toUpperCase() + req.params.body.slice(1).toLowerCase(),
      country: data.sys.country,
      temp: Math.round(data.main.temp - 273.15),
      weather: data.weather[0].main,
    };

    await redis.set(cacheKey, JSON.stringify(filteredData), 'EX', 1800);
    cb({ state: 200, data: filteredData });
  } catch (e) { cb({ state: e.response?.status || 504 }) } finally { console.log('~Request Completed~') };
});