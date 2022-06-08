const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: [
		"./index.html",
		"./src/**/*.{vue,js,ts,jsx,tsx}",
	],
	theme: {
		fontFamily: {
			'sans': ['Raileway', ...defaultTheme.fontFamily.sans]
		},
		extend: {},
	},
	plugins: [],
}
