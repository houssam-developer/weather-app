export const weatherService = (function () {
	const API_URL = 'https://api.openweathermap.org/data/2.5/';
	const API_KEY = 'c068eb94bf8c2ed2d66cb6a1cd1356f9';

	function seekCommon(argumentName = '', argumentVal = '', forecast = false) {
		let targetEndPoint = API_URL;

		if (forecast) { targetEndPoint += 'forecast' }
		else { targetEndPoint += 'weather' }

		if (argumentName) { targetEndPoint += `?${argumentName}=${argumentVal}`; }

		targetEndPoint += `&appid=${API_KEY}`;

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

	return {
		seekByCity
	}

})();