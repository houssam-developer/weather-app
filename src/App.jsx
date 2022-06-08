
import { useEffect, useRef, useState } from 'react';
import './App.scss';
import { weatherService } from './services/WeatherService';
import { MdLocationSearching, MdLocationOn } from "react-icons/md";


const TemperatureType = {
	CELSIUS: 'celsius',
	FAHRENHEIT: 'fahrenheit',
};

const TemperatureSymbol = {
	'celsius': '°C',
	'fahrenheit': '°F',
};

function App() {
	const [currentTemperatureType, setCurrentTemperatureType] = useState(TemperatureType.CELSIUS);
	const [weatherLocation, setWeatherLocation] = useState('');
	const [weatherDate, setWeatherDate] = useState('');
	const [weatherCloudsAll, setWeatherCloudsAll] = useState(0);
	const [weatherDescription, setWeatherDescription] = useState('');
	const [weatherIcon, setWeatherIcon] = useState('');
	const [weatherHumidity, setWeatherHumidity] = useState(0);
	const [weatherPressure, setWeatherPressure] = useState(0);
	const [weatherTemperatureMin, setWeatherTemperatureMin] = useState(0);
	const [weatherTemperatureCelsius, setWeatherTemperatureCelsius] = useState([]);
	const [weatherTemperatureFareheinheit, setWeatherTemperatureFareheinheit] = useState(0);
	const [weatherTemperatureMax, setWeatherTemperatureMax] = useState(0);
	const [weatherWindDeg, setWeatherWindDeg] = useState(0);
	const [weatherWindSpeed, setWeatherWindSpeed] = useState(0);

	useEffect(() => {
		const location = 'rabat'
		weatherService.seekByCity(location).then(data => {
			setWeatherLocation(location);
			setWeatherDate(new Date(data.dt * 1000 - (data.timezone * 1000)).toLocaleDateString());
			setWeatherCloudsAll(data.clouds.all);
			setWeatherDescription(data.weather[0].description);
			setWeatherIcon(data.weather[0].icon);
			setWeatherHumidity(data.main.humidity);
			setWeatherPressure(data.main.pressure);
			setWeatherTemperatureMin(data.main.temp_min);
			setWeatherTemperatureCelsius(weatherService.parseTemperatureCelsius(data.main.temp));
			setWeatherTemperatureMax(data.main.temp_max);
			setWeatherWindDeg(data.wind.deg);
			setWeatherWindSpeed(data.wind.speed);

			console.log('#data: ', data);
			console.log(`|__ dt #seconds: ${data.dt}`);
			console.log('	  |__timezone minus:', new Date(data.dt * 1000 - (data.timezone * 1000))); // minus 
			console.log('	  |__timezone plus: ', new Date(data.dt * 1000 + (data.timezone * 1000))); // plus
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

			{/* Today Recap */}
			<div className='flex flex-col h-screen bg-[#1e213a]'>
				{/* Location Buttons */}
				<div className='flex items-center justify-between  p-2'>
					<button className='bg-[#6E707A] font-medium p-2  text-[#e7e7eb] shadow-xl'>Search for places</button>
					<button className='bg-[#6E707A] font-medium p-2  text-[#e7e7eb] rounded-full shadow-xl'>
						<MdLocationSearching />
					</button>
				</div>

				<div className=' flex-grow text-white flex flex-col items-center'>
					<img className='max-w-[150px] py-8' src={`./images/openweather/${weatherIcon}.png`} alt="" />
					<div className='flex-grow w-full flex flex-col items-center'>
						<div className='flex items-center py-2'>
							<span className='text-6xl font-semibold'>{weatherTemperatureCelsius[0]}</span>
							<span className='text-7xl font-semibold pt-2'>{weatherTemperatureCelsius[1]}</span>
							<span className='text-[#a09fb1] text-2xl self-end pb-2 pl-1 font-semibold'>{TemperatureSymbol[currentTemperatureType]}</span>
						</div>
						<div className='text-[#a09fb1] font-semibold text-xl md:text-4xl'>{weatherService.firstLetterUppercase(weatherDescription)}</div>
						<div className='text-[#a09fb1] py-4'>Today - {weatherDate}</div>
						<div className='text-[#a09fb1] flex items-center gap-2'>
							<MdLocationOn size={20} />
							<span>{weatherService.firstLetterUppercase(weatherLocation)}</span>
						</div>
					</div>
				</div>

			</div>


			{/* <div className='ml-auto font-sans font-bold  flex justify-end items-center gap-2 mb-8'>
				<button className=' bg-slate-700 p-2 rounded-full px-3 text-white'>°C</button>
				<button className=' bg-slate-200 p-2 rounded-full px-3'>°F</button>
			</div>

			<section className='p-2 bg-slate-900 flex flex-col items-center gap-10'>
				<div className='text-white flex flex-col items-center justify-start'>
					<h2>Today</h2>
					<img className='max-w-[80px]' src={`./images/openweather/${weatherIcon}.png`} alt="" />
					<h3>{weatherDescription}</h3>
				</div>

				<div className=' text-white p-4 flex flex-wrap gap-4'>
					<div className='flex-[1_1_100px] bg-slate-700 p-2 rounded flex flex-col items-center gap-2'>
						<div>Location</div>
						<div>{weatherLocation.toUpperCase()}</div>
					</div>
					<div className='flex-[1_1_100px] bg-slate-700 p-2 rounded flex flex-col items-center gap-2'>
						<div>Date</div>
						<div>{weatherDate}</div>
					</div>
					<div className='flex-[1_1_100px] bg-slate-700 p-2 rounded flex flex-col items-center gap-2'>
						<div>Cloud</div>
						<div></div>
						<div>{weatherCloudsAll}%</div>
					</div>
					<div className='flex-[1_1_100px] bg-slate-700 p-2 rounded flex flex-col items-center gap-2'>
						<div>Humidity</div>
						<div>{weatherHumidity}%</div>
					</div>
					<div className='flex-[1_1_100px] bg-slate-700 p-2 rounded flex flex-col items-center gap-2'>
						<div>Pressure</div>
						<div>{weatherPressure}</div>
					</div>
					<div className='flex-[1_1_100px] bg-slate-700 p-2 rounded flex flex-col items-center gap-2'>
						<div>Temp Min</div>
						<div>{weatherTemperatureMin}</div>
					</div>
					<div className='flex-[1_1_100px] bg-slate-700 p-2 rounded flex flex-col items-center gap-2'>
						<div>Temp</div>
						<div>{weatherTemperature}</div>
					</div>
					<div className='flex-[1_1_100px] bg-slate-700 p-2 rounded flex flex-col items-center gap-2'>
						<div>Temp Max</div>
						<div>{weatherTemperatureMax}</div>
					</div>
					<div className='flex-[1_1_100px] bg-slate-700 p-2 rounded flex flex-col items-center gap-2'>
						<div>Wind Deg</div>
						<div>{weatherWindDeg}</div>
					</div>
					<div className='flex-[1_1_100px] bg-slate-700 p-2 rounded flex flex-col items-center gap-2'>
						<div>Wind Speed</div>
						<div>{weatherWindSpeed}</div>
					</div>
				</div>
			</section> */}
		</div>
	)
}

export default App;
