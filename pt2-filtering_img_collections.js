// location for bounds, in this case the city of El Paso. Use the inspector tool.

var city = ee.Geometry.Point(-106.48207, 31.76247);

// create a variable using the Geometry function Point, lat and lon



// add the point to the map

Map.addLayer(city);


//dates of interest

var start = ee.Date('2013-05-30');
var finish = ee.Date('2014-05-30');

// create image collection

var ElPaso = ee.ImageCollection('LANDSAT/LC8_L1T') // use ImageCollection ID
.filterBounds(city) //where to filter the area
.filterDate(start,finish)
.sort('CLOUD_COVER', false); //find cloud-free image

// get the number of images

var count = ElPaso.size();
print('size of collection ElPaso ', count);

// sort by a cloud cover property, get the least cloudy image

var best = ee.Image(ElPaso.sort('CLOUD_COVER').first());
print('Least cloudy image: ', best)

// get metadata

var date = best.get('DATE_ACQUIRED');
print('date taken ', date)