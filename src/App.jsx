
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
	const [weatherTemperatureCelsius, setWeatherTemperatureCelsius] = useState('');
	const [weatherTemperatureFareheinheit, setWeatherTemperatureFareheinheit] = useState([]);
	const [weatherTemperatureMax, setWeatherTemperatureMax] = useState(0);
	const [weatherWindDeg, setWeatherWindDeg] = useState(0);
	const [weatherWindSpeed, setWeatherWindSpeed] = useState(0);
	const [weatherNextDays, setweatherNextDays] = useState([]);

	const btnModalSearchSubmitRef = useRef();
	const inputModalSearchRef = useRef();
	const btnTemperatureCelsiusRef = useRef();
	const btnTemperatureFareheinheitRef = useRef();

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

		if (isCurrentPosition) { setWeatherLocation('Current Position'); }
		else { setWeatherLocation(targetLocation); }
		setWeatherDate(weatherService.formatDateTimestampToHuman(data.dt_txt, true));
		setWeatherCloudsAll(data.clouds.all);
		setWeatherDescription(data.weather[0].description);
		setWeatherIcon(data.weather[0].icon);
		setWeatherHumidity(data.main.humidity);
		setWeatherPressure(data.main.pressure);
		setWeatherTemperatureMin(data.main.temp_min);
		setWeatherTemperatureCelsius(data.main.temp);
		setWeatherTemperatureFareheinheit(weatherService.convertCelsiusToFahrenheit(data.main.temp));
		setWeatherTemperatureMax(data.main.temp_max);
		setWeatherWindDeg(data.wind.deg);
		setWeatherWindSpeed(data.wind.speed);

		updateCssVariable('--humidity-percent', `${data.main.humidity}`);
		updateCssVariable('--compas-deg', `${data.wind.deg}`);
	}

	function handleBtnSearchPlacesEvent(e) {
		e.preventDefault();
		updateCssVariable('--modal-search-left-position', '0');
		updateCssVariable('--modal-search-opacity', '1');
		updateCssVariable('--modal-search-pointer-events', 'initial');
	}

	function handleBtnCloseModal(e) {
		e.preventDefault();
		updateCssVariable('--modal-search-left-position', '-150');
		updateCssVariable('--modal-search-opacity', '0');
		updateCssVariable('--modal-search-pointer-events', 'none');
	}

	function handleFormModalSearchEvent(e) {
		e.preventDefault();
		setTargetLocation(inputModalSearchRef.current.value);
	}

	function handleBtnSuggestion(e) {
		e.preventDefault();
		inputModalSearchRef.current.focus();
		inputModalSearchRef.current.value = e.currentTarget.value;
		// trigger submit event
		btnModalSearchSubmitRef.current.click();

	}

	function handleBtnCurrentLocationCompas(e) {
		e.preventDefault();


		function updatePosition(position) {
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
			if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(updatePosition, showError); }
		} catch (err) {
			console.log(`🚫 handleBtnCurrentLocationCompas() #err: `, err);
		}
	}

	function handleBtnTemperature(type) {
		if (type === TemperatureType.CELSIUS) {
			btnTemperatureFareheinheitRef.current.classList.remove('btn-temperature--selected');
			btnTemperatureCelsiusRef.current.classList.add('btn-temperature--selected');
		}

		if (type === TemperatureType.FAHRENHEIT) {
			btnTemperatureCelsiusRef.current.classList.remove('btn-temperature--selected');
			btnTemperatureFareheinheitRef.current.classList.add('btn-temperature--selected');
		}

		setCurrentTemperatureType(type);
	}

	return (
		<div className="flex flex-col md:flex-row min-h-full mx-auto max-w-[1600px]">

			{/* Today Recap */}
			<div className='relative flex-[1_1_300px] min-w-[280px] md:max-w-[400px] min-h-screen bg-[#1e213a] flex flex-col '>

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
							{currentTemperatureType === TemperatureType.CELSIUS ?
								<span className='text-6xl font-semibold'>{weatherTemperatureCelsius}</span>
								:
								<span className='text-6xl font-semibold'>{weatherTemperatureFareheinheit}</span>
							}
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

			<div className='flex-grow text-[#E7E7EB] flex flex-col md:gap-4'>
				<div className='ml-auto  flex justify-end items-center gap-2 p-2 text-[#1f2245]'>
					<button ref={btnTemperatureCelsiusRef} onClick={() => handleBtnTemperature(TemperatureType.CELSIUS)} className='btn-temperature btn-temperature--selected'>°C</button>
					<button ref={btnTemperatureFareheinheitRef} onClick={() => handleBtnTemperature(TemperatureType.FAHRENHEIT)} className='btn-temperature'>°F</button>
				</div>

				{/* NEXT DAYS */}
				<div className=' p-4 flex flex-wrap gap-4 justify-center '>

					{
						weatherNextDays.map(it =>
							<div key={uuidv4()} className='flex flex-col items-center justify-center bg-[#1e213a] p-2 flex-[0_1_120px]'>
								<h3 className='font-medium'>{weatherService.formatDateTimestampToHuman(it.dt_txt)}</h3>
								<img className='max-w-[150px]' src={`./images/openweather/${it.weather[0].icon}.png`} alt="" />
								{
									currentTemperatureType === TemperatureType.CELSIUS ?
										<div className='flex items-center gap-4'>
											<div className='flex items-center py-2'>
												<span className='text-lg font-medium'>{it.main.temp_max}</span>
												<span className='text-lg self-end pb-1 pl-1 font-medium'>{TemperatureSymbol[currentTemperatureType]}</span>
											</div>
											<div className='flex items-center py-2 text-[#a09fb1]'>
												<span className='text-lg font-medium'>{it.main.temp_min}</span>
												<span className='text-lg self-end pb-1 pl-1 font-medium'>{TemperatureSymbol[currentTemperatureType]}</span>
											</div>
										</div>
										:
										<div className='flex items-center gap-4'>
											<div className='flex items-center py-2'>
												<span className='textlg font-medium'>{weatherService.convertCelsiusToFahrenheit(it.main.temp_max)}</span>
												<span className='text-lg self-end pb-1 pl-1 font-medium'>{TemperatureSymbol[currentTemperatureType]}</span>
											</div>
											<div className='flex items-center py-2 text-[#a09fb1]'>
												<span className='text-lg font-medium'>{weatherService.convertCelsiusToFahrenheit(it.main.temp_min)}</span>
												<span className='text-lg self-end pb-1 pl-1 font-medium'>{TemperatureSymbol[currentTemperatureType]}</span>
											</div>
										</div>
								}
							</div>
						)
					}


				</div>
				{/* TODAY HIGHTLIGHTS */}

				<div className=' text-[#e7e7eb] p-4 flex flex-col gap-4'>
					<h3 className='font-bold text-2xl mb-2'>Today's Hightlights</h3>
					<div className=' flex flex-wrap justify-center gap-4 md:gap-8 mx-auto'>

						{/* Wind Status */}
						<div className='p-4 bg-[#1e213a] flex-[1_1_280px] max-w-[300px] flex flex-col items-center  gap-5'>
							<h4 className='font-medium'>Wind Status</h4>
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
						<div className='p-4 bg-[#1e213a] flex-[1_1_280px] max-w-[300px] flex flex-col items-center justify-center gap-4'>
							<h4 className='font-medium'>Humidity</h4>
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
						<div className='p-4 bg-[#1e213a] flex-[1_1_280px] max-w-[300px] flex flex-col items-center justify-center gap-3'>
							<h4 className='font-medium'>Visibility</h4>
							<div className='flex items-center gap-2'>
								<span className='text-5xl font-bold'>{weatherCloudsAll}</span>
								<span className='text-2xl font-semibold'>miles</span>
							</div>
						</div>

						{/* Air Pressure */}
						<div className='p-4 bg-[#1e213a] flex-[1_1_280px] max-w-[300px] flex flex-col items-center gap-5'>
							<h4 className='font-medium'>Air Pressure</h4>
							<div className='flex items-center gap-2'>
								<span className='text-5xl font-bold'>{weatherPressure}</span>
								<span className='text-2xl font-semibold'>mb</span>
							</div>
						</div>

					</div>
				</div>
				<p className="text-[#ddd] text-center p-4 font-medium">created by <span className='font-semibold text-[#f2f2f2]'>houssam-developer</span> - devChallenges.io</p>
			</div>

		</div>
	)
}

export default App;
