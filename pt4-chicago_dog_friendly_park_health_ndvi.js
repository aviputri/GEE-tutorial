// Landsat-8 Images
var C_imgCollection = ee.ImageCollection('LANDSAT/LC8_L1T_32DAY_NDVI');

//Parks Polygons from data.gov
//create KML with Google Earth then copy the ID (open with Google Fusiontable)
var allparks = ee.FeatureCollection('ft:1bCK00LK7O1RsbObFWaENn1eNWaCdOVEAWr-7wGoY');

//Dog Friendly
var dogfriendly = ee.FeatureCollection('ft:1vAoI9Yp77roPGUlo_0i8Xk0STV6fkmxVsT7Il_q');

//ndvi date range
var ndvi_2014 = C_imgCollection.filterDate('2014-01-01', '2014-12-30').median();
var ndvi_2015 = C_imgCollection.filterDate('2015-01-01', '2015-12-30').median();

//Map.addLayer(allparks);
var diff_ndvi = ndvi_2015.subtract(ndvi_2014);

//Buffer function
//buffering a feature (dog friendly parks, within 100 m where are the parks)
var buff = function(feature){
	return feature.buffer(100);
};

//Park area buffer
var bufferPark = dogfriendly.map(buff);

//Display dog friendly parks
Map.addLayer(bufferPark);
Map.addLayer(dogfriendly,{color:'ff0000'});

//Selecting dog friendly parks
var ParksC = allparks.filterBounds(bufferPark);

//Display dog friendly parks
Map.addLayer(ParksC,{color:'fdcc00'});

var clippark2 = diff_ndvi.clip(ParksC)

var ndvi_palette =
	'FFFFFF, CE7E45, DF923D, F18555, FCD163, 99B718, 66A000, 74A901, 529400,' +
	'3E8601, 207401, 056201, 004C00, 023B01, 012E01, 011D01, 011301'

//in the end this palette was not used

	Map.addLayer(clippark2.{palette: 'FF0000, 000000, 00FF00', min: -0.15, max: 0.15});

//Getting data
var average = ParksC.map(function(feature) {
	var change = diff_ndvi.reduceRegion(ee.Reducer.mean(), feature.geometry(), 30);
	return feature.set({'change'; change});
})

//print(average)

//print Names and ndvi difference
var feature_data = average.getInfo().featuress;
for (var i = 0; i < feature_data.length; ++i) {
	var park_n = feature_data[i].properties;
	print(park_n.name+': ' + park_n.change.NDVI)
}