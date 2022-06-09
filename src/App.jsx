
import { useEffect, useRef, useState } from 'react';
import './App.scss';
import { weatherService } from './services/WeatherService';
import { MdLocationSearching, MdLocationOn, MdAssistantNavigation, MdSearch, MdKeyboardArrowRight, MdClose } from "react-icons/md";
import { data } from 'autoprefixer';
import { updateCssVariable } from './services/css-service';

import { v4 as uuidv4 } from 'uuid';

const TemperatureType = {
	CELSIUS: 'celsius',
	FAHRENHEIT: 'fahrenheit',
};

const TemperatureSymbol = {
	'celsius': '°C',
	'fahrenheit': '°F',
};



function App() {
	const [latitude, setLatitude] = useState('');
	const [longitude, setLongitude] = useState('');
	const [targetLocation, setTargetLocation] = useState('paris');
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
	const [weatherNextDays, setweatherNextDays] = useState([]);

	const btnModalSearchSubmitRef = useRef();
	const inputModalSearchRef = useRef();

	useEffect(() => {
		if (latitude && longitude) {
			weatherService.seekByLatitudeAndLongitude(latitude, longitude, true).then(it => {
				updateWeatherVariables(it, true);
			});
		}
	}, [latitude, longitude]);

	useEffect(() => {
		weatherService.seekByCity(targetLocation, true).then(it => {
			updateWeatherVariables(it, false);
		});
	}, [targetLocation]);

	function updateWeatherVariables(it, isCurrentPosition) {
		const data = it.list[0];
		setweatherNextDays(weatherService.parseNextFiveDays(it.list));
		console.log('#data: ', data);
		if (isCurrentPosition) { setWeatherLocation('Current Position'); }
		else { setWeatherLocation(targetLocation); }
		setWeatherDate(weatherService.formatDateTimestampToHuman(data.dt_txt, true));
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

		updateCssVariable('--humidity-percent', `${data.main.humidity}`);
		updateCssVariable('--compas-deg', `${data.wind.deg}`);
	}

	function handleBtnSearchPlacesEvent(e) {
		e.preventDefault();
		updateCssVariable('--modal-search-left-position', '0');
	}

	function handleBtnCloseModal(e) {
		e.preventDefault();
		updateCssVariable('--modal-search-left-position', '-150%');
	}

	function handleFormModalSearchEvent(e) {
		e.preventDefault();
		console.log(`📃 handleFormModalSearcEvent(), `, e.target);

		setTargetLocation(inputModalSearchRef.current.value);
	}

	function handleBtnSuggestion(e) {
		e.preventDefault();
		console.log(`📦 handleBtnSuggestion() `, e.currentTarget);

		inputModalSearchRef.current.focus();
		inputModalSearchRef.current.value = e.currentTarget.value;

		// trigger submit event
		btnModalSearchSubmitRef.current.click();

	}

	function handleBtnCurrentLocationCompas(e) {
		e.preventDefault();
		console.log(`🚀 handleBtnCurrentLocationCompas()`);

		function showPosition(position) {
			console.log(`📡 showPosition() #position: `, position.coords.latitude);
			console.log(`📡 showPosition() #position: `, position.coords.longitude);

			setLatitude(position.coords.latitude);
			setLongitude(position.coords.longitude);
		}

		function showError(e) {
			if (e.code === 1) { alert('Can not get current position (Permission Denied)') }
			else if (e.code === 2) { alert('Can not get current position (Position unavailable)') }
			else if (e.code === 3) { alert('Can not get current position (Timeout)') }
			else {
				alert('Can not get current position')
			}
		}

		try {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(showPosition, showError);
			} else {
				console.log(`🚩 BLOCKED`);
			}
		} catch (err) {
			console.log(`🚫 handleBtnCurrentLocationCompas() #err: `, err);
		}
	}

	return (
		<div className="flex flex-col md:flex-row min-h-full">

			{/* Today Recap */}
			<div className='relative flex-[1_1_300px] min-w-[280px] min-h-screen bg-[#1e213a] flex flex-col'>

				{/* Modal Search */}
				<div className='search-modal'>
					<div className='flex justify-end'>
						<button onClick={handleBtnCloseModal}>
							<MdClose size={24} />
						</button>
					</div>
					<form className='w-full flex flex-col gap-8' onSubmit={handleFormModalSearchEvent}>
						<div className='flex items-center justify-between gap-2'>
							<div className='container-search-input'>
								<MdSearch size={24} className='min-w-[24px]' />
								<input ref={inputModalSearchRef} type="text" placeholder='Search location' name='location' />
							</div>
							<button ref={btnModalSearchSubmitRef} type='submit' className='bg-[#3C47E9] border-[1px] border-[#3C47E9] p-3 font-semibold'>Search</button>
						</div>
						<div className='flex flex-col gap-2'>
							<button value={'London'} onClick={handleBtnSuggestion} className='search-suggestion'>
								<span>London</span>
								<MdKeyboardArrowRight size={20} />
							</button>
							<button value={'Barcelona'} onClick={handleBtnSuggestion} className='search-suggestion'>
								<span>Barcelona</span>
								<MdKeyboardArrowRight />
							</button>
							<button value={'Long Beach'} onClick={handleBtnSuggestion} className='search-suggestion'>
								<span>Long Beach</span>
								<MdKeyboardArrowRight />
							</button>
						</div>
					</form>
				</div>

				{/* Location Buttons */}
				<div className='flex items-center justify-between  p-2'>
					<button onClick={handleBtnSearchPlacesEvent} className='bg-[#6E707A] font-medium p-2  text-[#e7e7eb] shadow-xl'>Search for places</button>
					<button onClick={handleBtnCurrentLocationCompas} className='bg-[#6E707A] font-medium p-2  text-[#e7e7eb] rounded-full shadow-xl'>
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
						<div className='text-[#a09fb1] py-4'>Today &#8226; {weatherDate}</div>
						<div className='text-[#a09fb1] flex items-center gap-2'>
							<MdLocationOn size={20} />
							<span>{weatherService.firstLetterUppercase(weatherLocation)}</span>
						</div>
					</div>
				</div>
			</div>

			<div className='flex-grow text-[#E7E7EB] flex flex-col'>
				{/* NEXT DAYS */}
				<div className=' p-4 flex flex-wrap gap-4 justify-center '>

					{
						weatherNextDays.map(it =>
							<div key={uuidv4()} className='flex flex-col items-center justify-center bg-[#1e213a] p-2 flex-[0_1_120px]'>
								<h3 className='font-medium'>{weatherService.formatDateTimestampToHuman(it.dt_txt)}</h3>
								<img className='max-w-[150px]' src={`./images/openweather/${it.weather[0].icon}.png`} alt="" />
								<div className='flex items-center gap-4'>
									<div className='flex items-center py-2'>
										<span className='font-medium'>{weatherService.parseTemperatureCelsius(it.main.temp_max)[0]}</span>
										<span className='text-lg font-medium'>{weatherService.parseTemperatureCelsius(it.main.temp_max)[1]}</span>
										<span className='text-lg self-end pb-1 pl-1 font-medium'>{TemperatureSymbol[currentTemperatureType]}</span>
									</div>
									<div className='flex items-center py-2 text-[#a09fb1]'>
										<span className=' font-medium'>{weatherService.parseTemperatureCelsius(it.main.temp_min)[0]}</span>
										<span className='text-lg font-medium'>{weatherService.parseTemperatureCelsius(it.main.temp_min)[1]}</span>
										<span className='text-lg self-end pb-1 pl-1 font-medium'>{TemperatureSymbol[currentTemperatureType]}</span>
									</div>
								</div>
							</div>
						)
					}


				</div>
				{/* TODAY HIGHTLIGHTS */}

				<div className='text-[#e7e7eb] min-h-screen p-4 flex flex-col gap-4'>
					<h3>Today's Hightlights</h3>
					<div className='flex flex-wrap gap-4'>
						{/* Wind Status */}
						<div className='p-4 bg-[#1e213a] min-w-[50px] min-h-[100px] flex-[1_1_280px] flex flex-col items-center gap-3'>
							<h4>Wind Status</h4>
							<div className='flex items-center gap-1'>
								<span className='text-5xl font-bold'>{weatherService.convertMetersPerSecToMPH(weatherWindSpeed)}</span>
								<span className='text-2xl font-medium'>mph</span>
							</div>
							<div className='flex items-center gap-2'>
								<MdAssistantNavigation fill='#6E707A' className='compas-wind' />
								<span>{weatherService.convertDegreeToCompassPoint(weatherWindDeg)}</span>
							</div>
						</div>

						{/* Humidity */}
						<div className='p-4 bg-[#1e213a] min-w-[50px] min-h-[100px] flex-[1_1_280px] flex flex-col items-center gap-3'>
							<h4>Humidity</h4>
							<div className='flex items-center gap-1'>
								<span className='text-5xl font-bold'>{weatherHumidity}</span>
								<span className='text-2xl font-medium'>%</span>
							</div>
							<div className='w-full'>
								<div className='flex items-center justify-between humidity-bar mb-1'>
									<span>0</span>
									<span>50</span>
									<span>100</span>
								</div>
								<div className='flex justify-end'>%</div>
							</div>
						</div>

						{/* Visibility */}
						<div className='p-4 bg-[#1e213a] min-w-[50px] min-h-[100px] flex-[1_1_280px] flex flex-col items-center gap-3'>
							<h4>Visibility</h4>
							<div className='flex items-center gap-2'>
								<span className='text-5xl font-bold'>{weatherCloudsAll}</span>
								<span className='text-2xl font-semibold'>miles</span>
							</div>
						</div>

						{/* Air Pressure */}
						<div className='p-4 bg-[#1e213a] min-w-[50px] min-h-[100px] flex-[1_1_280px] flex flex-col items-center gap-3'>
							<h4>Air Pressure</h4>
							<div className='flex items-center gap-2'>
								<span className='text-5xl font-bold'>{weatherPressure}</span>
								<span className='text-2xl font-semibold'>mb</span>
							</div>
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
