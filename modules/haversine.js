// haversine functions copied from
// https://github.com/brandon93s/haversine-js
//
// const atlanta = {
  // latitude: 33.7490,
  // longitude: -84.3880
// };

// const london = {
  // latitude: 51.5074,
  // longitude: -0.1278
// };

// const options = {
  //   radius: haversine.EARTH.MILE
// };

// haversine(atlanta, london, options).toFixed(0);
const earth = {
	MILE: 3959,
	KM: 6371,
	M: 6371000,
	NMI: 3440
};

haversine.EARTH = earth;

export default function haversine(start, end, options) {
	options = defaults(options);

	const startLatitude = getRadians(start.latitude, options.isRadians);
	const endLatitude = getRadians(end.latitude, options.isRadians);
	const longitudeDelta = coordinateDifference(start.longitude, end.longitude, options.isRadians);

	const c = Math.acos((Math.sin(startLatitude) * Math.sin(endLatitude)) + (Math.cos(startLatitude) * Math.cos(endLatitude) * Math.cos(longitudeDelta)));

	return options.radius * c;
}

function coordinateDifference(a, b, isRadians) {
	const delta = b - a;
	return getRadians(delta, isRadians);
}

function getRadians(input, isRadians) {
	return isRadians ? input : (input * (Math.PI / 180));
}

function defaults(options) {
	options = options || {};
	options.radius = options.radius || earth.MILE;
	options.isRadians = (typeof options.isRadians === 'boolean') ? options.isRadians : false;

	return options;
}

