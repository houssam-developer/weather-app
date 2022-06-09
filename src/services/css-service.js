export const updateCssVariable = (function () {
	const ROOT_DOCUMENT = document.querySelector(':root');

	return function (tag, tagVal) {
		ROOT_DOCUMENT.style.setProperty(tag, tagVal);
	}

})();