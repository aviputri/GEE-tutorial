 //----------------NDVI Calculation----------------//



//Create Band Variables
var B4_Red = best.select('B4');
var B5_NIR = best.select('B5');

//Calculation of NDVI using GEE Help Methods
var ndvi1 = B5_NIR.subtract(B4_Red).divide(B5_NIR.add(B4_Red));


//Calculation of NDVI Using Personal Method
var ndvi2 = best.expression(
	'(B5-B4)/(B5+B4)', {
		'B5': B5_NIR,
		'B4': B4_Red
	});

//Used for display only - Obtained from GEE Help
var ndvi_palette =
	'FFFFFF, CE7E45, DF923D, F18555, FCD163, 99B718, 66A000, 74A901, 529400,' +
	'3E8601, 207401, 056201, 004C00, 023B01, 012E01, 011D01, 011301'

//Map.addLayer(best)

Map.addLayer(ndvi1, (min: -0.1, max: 1.0, palette: ndvi_palette), 'NDVI 1');
Map.addLayer(ndvi2, (min: -0.1, max: 1.0, palette: ndvi_palette), 'NDVI 2');