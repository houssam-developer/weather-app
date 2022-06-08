
import { useEffect, useRef, useState } from 'react';
import './App.scss';
import { weatherService } from './services/WeatherService';


function App() {

	useEffect(() => {
		weatherService.seekByCity('tokyo').then(data => {
			console.log('#data: ', data);
			console.log(`|__ coord #lon: ${data.coord.lon} #lat: ${data.coord.lat}\n`);
			console.log(`|__ cloud #all: ${data.clouds.all}\n`);
			console.log(`|__ main #humidity: ${data.main.humidity}`);
			console.log(`|__ main #pressure: ${data.main.pressure}`);
			console.log(`|__ main #temp_min: ${data.main.temp_min}`);
			console.log(`|__ main #temp_max: ${data.main.temp_max}\n`);
			console.log(`|__ wind #deg: ${data.wind.deg}`);
			console.log(`|__ wind #speed: ${data.wind.speed}`);
		});


	}, [])

	return (
		<div className="">
			<h1>Hello world!</h1>
		</div>
	)
}

export default App;
