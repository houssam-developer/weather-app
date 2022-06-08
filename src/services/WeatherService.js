export const weatherService = (function () {
	const API_URL = 'https://api.openweathermap.org/data/2.5/';
	const API_KEY = 'c068eb94bf8c2ed2d66cb6a1cd1356f9';

	function seekCommon(argumentName = '', argumentVal = '', forecast = false) {
		let targetEndPoint = API_URL;

		if (forecast) { targetEndPoint += 'forecast' }
		else { targetEndPoint += 'weather' }

		if (argumentName) { targetEndPoint += `?${argumentName}=${argumentVal}`; }

		// standard for kelvius
		// metric for celsius
		// imperial for fareheinheit
		targetEndPoint += `&units=metric&appid=${API_KEY}`;

		try {
			return fetch(targetEndPoint).then(resp => resp.json());
		} catch (ex) {
			console.log('seekCommon() ERROR : ', ex);
		}
	}

	// seekDefault[defaultCurrentLocation]
	// seekByMyCurrentLocation
	// seekCurrentLocationTodayAndNext_5_Days
	// 

	function seekByCity(argumentVal, forecast = false) {
		return seekCommon('q', argumentVal, forecast);
	}

	function convertCelsiusToFahrenheit(c) {
		let cVal;
		if (!isNaN(c)) {
			try {
				cVal = Number(c);
			} catch (err) {
				console.log('convertCelsiusToFahrenheit() conversion c to number failed !!');
				return;
			}
		}

		return parseFloat((cVal * 9 / 5) + 32).toFixed(2);
	}

	function convertFahrenheitToCelsius(f) {
		let fVal;
		if (!isNaN(f)) {
			try {
				fVal = Number(f);
			} catch (err) {
				console.log('convertFahrenheitToCelsius() conversion f to number failed !!');
				return;
			}
		}

		// Deduct 32, then multiply by 5, then divide by 9
		return parseFloat(((fVal - 32) * 5) / 9).toFixed(2);
	}

	function parseTemperatureCelsius(c) {
		let cVal;
		try {
			cVal = Number(c);
			const cValUpdated = parseFloat(cVal).toFixed(0);
			const tempArray = [];
			const cValString = cValUpdated.toString();
			console.log('++++++++++++ cValString', cValString);
			for (let i = 0; i < cValString.length; i++) {
				let num = Number(cValString.charAt(i));
				console.log('>>>>>>>>>> num: ', num);
				tempArray.push(num);
			}

			//console.log('++++++++++++ tempArray', tempArray);
			return tempArray;
		} catch {
			console.log('parseTemperatureCelsius() FAILED');
			return [];
		}
	}

	function firstLetterUppercase(s) {
		return s.charAt(0).toUpperCase() + s.slice(1);
	}

	function convertMetersPerSecToMPH(mps) {
		const mph = +((2.23694 * mps).toFixed(2));
		return mph;
	}

	function convertDegreeToCompassPoint(wind_deg) {
		// const compassPoints = ["North", "North North East", "North East", "East North East",
		// 	"East", "East South East", "South East", "South South East",
		// 	"South", "South South West", "South West", "West South West",
		// 	"West", "West North West", "North West", "North North West"];

		const compassPoints = ["N", "NNE", "NE", "ENE",
			"E", "ESE", "SE", "SSE",
			"S", "SSW", "SW", "WSW",
			"W", "WNW", "NW", "NNW"];
		const rawPosition = Math.floor((wind_deg / 22.5) + 0.5);
		const arrayPosition = (rawPosition % 16);
		return compassPoints[arrayPosition];
	};

	return {
		seekByCity,
		convertCelsiusToFahrenheit,
		convertFahrenheitToCelsius,
		parseTemperatureCelsius,
		firstLetterUppercase,
		convertMetersPerSecToMPH,
		convertDegreeToCompassPoint
	}

})();