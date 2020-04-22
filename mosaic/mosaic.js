// Load a NAIP quarter quad, display.
var naip = ee.Image('USDA/NAIP/DOQQ/m_4207148_nw_19_1_20120710');
Map.setCenter(-71.0915, 42.3443, 14);
Map.addLayer(naip, {}, 'NAIP DOQQ');

// Create the NDVI and NDWI spectral indices.
var ndvi = naip.normalizedDifference(['N', 'R']);
var ndwi = naip.normalizedDifference(['G', 'N']);

// Create some binary images from thresholds on the indices.
// This threshold is designed to detect bare land.
var bare1 = ndvi.lt(0.2).and(ndwi.lt(0.3));
// This detects bare land with lower sensitivity. It also detects shadows.
var bare2 = ndvi.lt(0.2).and(ndwi.lt(0.8));

// Define visualization parameters for the spectral indices.
var ndviViz = {min: -1, max: 1, palette: ['FF0000', '00FF00']};
var ndwiViz = {min: 0.5, max: 1, palette: ['00FFFF', '0000FF']};

// Mask and mosaic visualization images.  The last layer is on top.
var mosaic = ee.ImageCollection([
  // NDWI > 0.5 is water.  Visualize it with a blue palette.
  ndwi.updateMask(ndwi.gte(0.5)).visualize(ndwiViz),
  // NDVI > 0.2 is vegetation.  Visualize it with a green palette.
  ndvi.updateMask(ndvi.gte(0.2)).visualize(ndviViz),
  // Visualize bare areas with shadow (bare2 but not bare1) as gray.
  bare2.updateMask(bare2.and(bare1.not())).visualize({palette: ['AAAAAA']}),
  // Visualize the other bare areas as white.
  bare1.updateMask(bare1).visualize({palette: ['FFFFFF']}),
]).mosaic();
Map.addLayer(mosaic, {}, 'Visualization mosaic');