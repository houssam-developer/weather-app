
import { useEffect, useRef, useState } from 'react';
import './App.scss';
import { weatherService } from './services/WeatherService';


function App() {
	const [weatherLocation, setWeatherLocation] = useState('');
	const [weatherDate, setWeatherDate] = useState(undefined);
	const [weatherCloudsAll, setWeatherCloudsAll] = useState(0);
	const [weatherHumidity, setWeatherHumidity] = useState(0);
	const [weatherPressure, setWeatherPressure] = useState(0);
	const [weatherTemperatureMin, setWeatherTemperatureMin] = useState(0);
	const [weatherTemperature, setWeatherTemperature] = useState(0);
	const [weatherTemperatureMax, setWeatherTemperatureMax] = useState(0);
	const [weatherWindDeg, setWeatherWindDeg] = useState(0);
	const [weatherWindSpeed, setWeatherWindSpeed] = useState(0);

	useEffect(() => {
		const location = 'rabat'
		weatherService.seekByCity(location).then(data => {
			setWeatherLocation(location);
			setWeatherDate(new Date(data.dt * 1000 - (data.timezone * 1000)));
			setWeatherCloudsAll(data.clouds.all);
			setWeatherHumidity(data.main.humidity);
			setWeatherPressure(data.main.pressure);
			setWeatherTemperatureMin(data.main.temp_min);
			setWeatherTemperature(data.main.temp);
			setWeatherTemperatureMax(data.main.temp_max);
			setWeatherWindDeg(data.wind.deg);
			setWeatherWindSpeed(data.wind.speed);

			// console.log('#data: ', data);
			// console.log(`|__ dt #seconds: ${data.dt}`);
			// console.log('	  |__timezone minus:', new Date(data.dt * 1000 - (data.timezone * 1000))); // minus 
			// console.log('	  |__timezone plus: ', new Date(data.dt * 1000 + (data.timezone * 1000))); // plus
			// console.log(`|__ coord #lon: ${data.coord.lon} #lat: ${data.coord.lat}\n`);
			// console.log(`|__ cloud #all: ${data.clouds.all}\n`);
			// console.log(`|__ main #humidity: ${data.main.humidity}`);
			// console.log(`|__ main #pressure: ${data.main.pressure}`);
			// console.log(`|__ main #temp_min: ${data.main.temp_min}`);
			// console.log(`|__ main #temp_max: ${data.main.temp_max}\n`);
			// console.log(`|__ wind #deg: ${data.wind.deg}`);
			// console.log(`|__ wind #speed: ${data.wind.speed}`);
		});
	}, [])

	return (
		<div className="">
			<div>

			</div>
		</div>
	)
}

export default App;
