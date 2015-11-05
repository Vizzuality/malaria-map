(function() {

  'use strict';

  var map;
  var CLIENT_ID = '390573081381-gnqu230pbi1t7gmd04anqi39j81qsr0n' +
    '.apps.googleusercontent.com';

  // Run this when EE analysis is fetched
  function checkTokens(layerConfig) {
    var LAYERS_CONFIG = layerConfig;

    var baseLayers = {
      'Road Map': L.tileLayer('http://a.tiles.mapbox.com/v4/darkit.mb80h2ac/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGFya2l0IiwiYSI6IkhtblZxN2MifQ.4Se0dQvGFVxnnCrzPkoz3g').addTo(map),
      'Satellite': L.tileLayer('http://a.tiles.mapbox.com/v4/adammulligan.m8ei7b99/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYWRhbW11bGxpZ2FuIiwiYSI6ImNiMDYxMzkwOGJjYTJjZjhmZmY3YmUyZTljMDZjZGNjIn0.E30Oy7L6hXBm2vtmQoWZJA')
    };

    var groupedOverlays = {
      "base": {},
      "risk": {}
    }

    var createRiskLayers = function() {
      LAYERS_CONFIG.overlays.forEach(function(layerConfig, index) {
        var layer = L.tileLayer('https://earthengine.googleapis.com/map/'+layerConfig[0]+'/{z}/{x}/{y}?token='+layerConfig[1])
        groupedOverlays.risk[layerConfig[2]] = layer;

        // Set first layer as default
        if (index === 0) { layer.addTo(map); }
      });
    };

    var createBaseLayers = function() {
      LAYERS_CONFIG.basemaps.forEach(function(layerConfig, index) {
        var layer = L.tileLayer('https://earthengine.googleapis.com/map/'+layerConfig[0]+'/{z}/{x}/{y}?token='+layerConfig[1])
        groupedOverlays.base[layerConfig[2]] = layer;

        // Set first layer as default
        if (index === 0) { layer.addTo(map); }
      });
    };

    var createCartoLayer = function(name, url) {
      return function(callback) {
        cartodb.createLayer(map, url)
          .on('done', function(layer) {
            callback(null, {name: name, layer: layer});
          });
      };
    };

    async.parallel([
      createCartoLayer("Case Data", "https://simbiotica.cartodb.com/api/v2/viz/deb87ad2-084a-11e5-aead-0e0c41326911/viz.json"),
      createCartoLayer("Cities in Danger", "https://simbiotica.cartodb.com/api/v2/viz/81ede332-084a-11e5-aaa3-0e0c41326911/viz.json")
    ], function(err, results) {
      createBaseLayers();
      createRiskLayers();
      results.forEach( function(result) {
        groupedOverlays.risk[result.name] = result.layer;
      });

      L.control.customLayers(baseLayers, groupedOverlays, {
        exclusiveGroups: ["base"],
        position: 'topleft',
        collapsed: false
      }).addTo(map);

      // Map labels
      L.tileLayer("http://a.tiles.mapbox.com/v4/aliciarenzana.mb99h2am/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYWxpY2lhcmVuemFuYSIsImEiOiJjOTQ2OThkM2VkY2I5MjYwNTUyNmIyMmEyZWFmOGZjMyJ9.sa4f1HalXYr3GYTRAsdnzA")
        .addTo(map)
        .setZIndex(9999);

      // Swaziland outline
      cartodb.createLayer(map, "https://simbiotica.cartodb.com/api/v2/viz/77f88568-0862-11e5-9da9-0e9d821ea90d/viz.json")
        .addTo(map)
        .on('done', function(layer) { layer.setZIndex(9998); });
    });
  }

  // Runs the EE analysis
  function runAnalysis() {
    console.info('running...');

    ee.initialize();

    var NDVI_PALETTE = '\
    <RasterSymbolizer>\
      <ColorMap bands="NDVI" type="intervals" extended="false" >\
        <ColorMapEntry color="#BC8B50" quantity="-0.1" label="Water" opacity="0"/>\
        <ColorMapEntry color="#BC8B50" quantity="0.1" label="non Vegetation" />\
        <ColorMapEntry color="#E7E9E4" quantity="0.2" label="transition" />\
        <ColorMapEntry color="#BDD9B6" quantity="0.3" label="minor" />\
        <ColorMapEntry color="#80C071" quantity="0.5" label="medium" />\
        <ColorMapEntry color="#55AF43" quantity="0.8" label="high" />\
      </ColorMap>\
    </RasterSymbolizer>';

    var EVI_PALETTE = 'FFFFFF, CE7E45, DF923D, F1B555, FCD163, 99B718, 74A901, 66A000, 529400,' +
        '3E8601, 207401, 056201, 004C00, 023B01, 012E01, 011D01, 011301'

    var NDWI_PALETTE = '\
    <RasterSymbolizer>\
      <ColorMap bands="NDWI" type="ramp" extended="false" >\
        <ColorMapEntry color="#BC8B50" quantity="-0.2" label="0.1-0.2" opacity="0.5" />\
        <ColorMapEntry color="#D6C3A8" quantity="-0.1" label="0.2-0.4" opacity="0.5" />\
        <ColorMapEntry color="#E7E9E4"  quantity="0" label="0.4-0.6" opacity="0.5" />\
        <ColorMapEntry color="#BCCDE8" quantity="0.4" label="0.6-0.8" opacity="0.5" />\
        <ColorMapEntry color="#83A8EB" quantity="0.5" label="0.8-1" opacity="0.5" />\
      </ColorMap>\
    </RasterSymbolizer>';

                                          //temperatures - intervals
    var LST_PALETTE ='\
    <RasterSymbolizer>\
      <ColorMap  type="intervals" extended="true" >\
        <ColorMapEntry color="#848FF0" quantity="24" label="lte 0"/>\
        <ColorMapEntry color="#BDC2EA" quantity="26" label="0.1-0.2"/>\
        <ColorMapEntry color="#E7E9E4" quantity="28" label="0.2-0.4"/>\
        <ColorMapEntry color="#EAD388"  quantity="30" label="0.4-0.6"/>\
        <ColorMapEntry color="#EFB400" quantity="32" label="0.8-1"/>\
      </ColorMap>\
    </RasterSymbolizer>';
                                          //Elevation - Ramp
    var Elevation_PALETTE ='\
    <RasterSymbolizer>\
      <ColorMap  bands="elevation" type="intervals" extended="false" >\
        <ColorMapEntry color="#719B5C" quantity="200" label="lte 0" opacity="1"/>\
        <ColorMapEntry color="#C4D1BB" quantity="500" label="0.1-0.2" opacity="0.5" />\
        <ColorMapEntry color="#E7E9E4" quantity="1000" label="0.2-0.4" opacity="0.5" />\
        <ColorMapEntry color="#CFC6AC"  quantity="1500" label="0.4-0.6" opacity="0.5" />\
        <ColorMapEntry color="#AE9762" quantity="2000" label="0.8-1" opacity="0.5" />\
      </ColorMap>\
    </RasterSymbolizer>';
                                           //Slope - Ramp
    var Slope_PALETTE = '\
    <RasterSymbolizer>\
      <ColorMap  type="ramp" extended="false" >\
        <ColorMapEntry color="#ff0000" quantity="0" label="0.1-0.2" opacity="0.5" />\
        <ColorMapEntry color="#FF3300" quantity="15" label="0.2-0.4" opacity="0.5" />\
        <ColorMapEntry color="#ffff00"  quantity="30" label="0.4-0.6" opacity="0.5" />\
        <ColorMapEntry color="#00ff00" quantity="45" label="0.6-0.8" opacity="0.5" />\
        <ColorMapEntry color="#66ffff" quantity="60" label="0.8-1" opacity="0.5" />\
      </ColorMap>\
    </RasterSymbolizer>';
                                            //Hansen Water map - Ramp
    var water_palette ='\
    <RasterSymbolizer>\
      <ColorMap  type="values" extended="false" >\
        <ColorMapEntry color="#0000CC" quantity="0" label="0" opacity="0"/>\
        <ColorMapEntry color="#0000FF" quantity="1" label="1" opacity="1" />\
      </ColorMap>\
    </RasterSymbolizer>';

                                          //distance to Water - Ramp

    var dist_to_water ='\
    <RasterSymbolizer>\
      <ColorMap  type="intervals" extended="false" >\
        <ColorMapEntry color="#019EAC" quantity="0"  opacity="1" />\
        <ColorMapEntry color="#57C5CB" quantity="20" opacity="1" />\
        <ColorMapEntry color="#7BCBCD" quantity="50" opacity="1" />\
        <ColorMapEntry color="#D0DED7" quantity="100" opacity="1" />\
        <ColorMapEntry color="#E7E9E4" quantity="120" opacity="1" />\
      </ColorMap>\
    </RasterSymbolizer>';

                                          //SLD - Discrete Intervals

    var sld_intervals = '\
    <RasterSymbolizer>\
      <ColorMap  type="intervals" extended="false" >\
        <ColorMapEntry color="#0000CC" quantity="0" label="lte 0" opacity="0"/>\
        <ColorMapEntry color="#66FFCC" quantity="0.2" label="0.1-0.2" opacity="0.5" />\
        <ColorMapEntry color="#A91005" quantity="0.4" label="0.2-0.4" opacity="0.5" />\
        <ColorMapEntry color="#A91005"  quantity="0.6" label="0.4-0.6" opacity="0.5" />\
        <ColorMapEntry color="#000000" quantity="0.8" label="0.6-0.8" opacity="0.5" />\
        <ColorMapEntry color="#000000" quantity="1" label="0.8-1" opacity="0.5" />\
      </ColorMap>\
    </RasterSymbolizer>';

    //··········································································································
    //                                          Computation Area
    //··········································································································

    // Create polygon for Swaziland
    var Swaziland = ee.FeatureCollection('ft:1zmvdNOGmi0AG8BQY09wKknM2N5K_3YQwBL8nRSxQ');

    //add locations (villages and towns)
    var cities = ee.FeatureCollection('ft:1CkkgO7nl58eRWQ9TLI_IGKVK3lnFeVdrPw-cyYW7');
    var tests = ee.FeatureCollection(cities);

    //var parksWithArea = parks.map(addArea);

    //Map.addLayer(cities.draw('FF0000', 2, 2));

    //addToMap(Swaziland, {'color': 'FF0000'});
    //Map.setCenter(32, -26, 8);

    //Environmental variables
    var ndvicollection = ee.ImageCollection('LANDSAT/LC8_L1T_8DAY_NDVI').filterDate('2014-01-01', '2014-10-30');
    var evicollection = ee.ImageCollection('LANDSAT/LC8_L1T_8DAY_EVI').filterDate('2014-01-01', '2014-10-30');
    var lstcollection = ee.ImageCollection('MODIS/MOD11A2').filterDate('2014-01-01', '2014-10-30').select("LST_Day_1km");
    var ndwicollection = ee.ImageCollection('LANDSAT/LE7_L1T_8DAY_NDWI').filterDate('2014-01-01', '2014-10-30');

    //Function to add the risk value data to a feature collection
    var addRisk_value = function(feature) {
      var risk = RiskNeighbors.reduceRegion(ee.Reducer.mean(), feature.geometry(), 30);
      var newFeature = feature.set({risk_value: risk.get('classification')});
      return newFeature;
    };

    // A function to generate LST in Degree Centigrade (rescale)
    var LST_Res = function(image) {
        var LST_temp = image.toFloat().multiply(0.02).subtract(273.15);
        image = image.addBands(LST_temp);
        return image;
    }
    // Radiance Function
    function radians(img) {
      return img.toFloat().multiply(Math.PI).divide(180);
    }
    //funtion to extract token and map id
    var layers_config={
      basemaps:[],
      overlays:[]
    };

    var get_idmap = function(image, config, name) {
        var imageObject = image.getMap(config);
        var arrayi = [];
        arrayi[0] = imageObject.mapid;
        arrayi[1] = imageObject.token;
        arrayi[2] = name;
        return arrayi;
    }

    //new LST
    var LST_new = lstcollection.map(LST_Res);
    //print(LST_new.getInfo());

    //Topographic variables
    var elev = ee.Image('CGIAR/SRTM90_V4').clip(Swaziland);

    var terrain = ee.Algorithms.Terrain(ee.Image('CGIAR/SRTM90_V4'));
    var slope = radians(terrain.select('slope')).clip(Swaziland);
    var slope_perc = slope.multiply(100);

    // Hansen 30 meter water mask
    // Create an image that has value 1 where the datamask and has value 2, and value 0 everywhere else.
    var water = ee.Image('UMD/hansen/global_forest_change_2013').select('datamask').eq(2).clip(Swaziland);


    //Compute distance to water bodies
    var pixels = ee.Kernel.euclidean(120, "pixels");
    var dist_water = water.distance(pixels);

    // Compute the pixel values in the collection for display.
    var ndvi = ndvicollection.median().clip(Swaziland);
    //print(ndvi.getInfo());
    var evi = evicollection.median().clip(Swaziland);
    //print(evi.getInfo());
    var ndwi = ndwicollection.median().clip(Swaziland);
    //print(ndwi.getInfo());
    var lst = LST_new.select("LST_Day_1km_1").median().clip(Swaziland);
    //print(lst.getInfo());

    //Combine environmental variables to prepare for the Random Forests model
    //var combined = ee.Image.cat(evi, ndvi, ndwi, lst, slope_clip, elev_clip);
    var combined = ee.Image.cat(elev, ndwi);

    //Fusion table with case data
    var cases = ee.FeatureCollection('ft:1-UWLAnMQTVwX1Uig73URnMI0wUglMk9-N8lyjQPZ');
    var Case = cases.filter(ee.Filter.eq('Case', 1));
    var display1 = Case.draw('FF0000', 2, 2);
    var Control = cases.filter(ee.Filter.eq('Case', 0));
    var display2 = Control.draw('00FF00', 2, 2);
    var proj = ee.Projection('EPSG:4326').atScale(30);
    // Train the classifier with specified inputs.
    var scale = 30 / 111320;
    var classifier = combined.trainClassifier({
    "bands":["elevation","NDWI"],
    "classifier_name": "RifleSerialClassifier",
    "training_features": cases,
    "training_property": "Case",
    "classifier_parameters": "number_of_trees: 2",
    "classifier_mode": "probability",
    "crs": "EPSG:4326",
    "crs_transform": [8.9831528411952135e-05, 0, -180, 0, -8.9831528411952135e-05, 90]
    });
    // Apply the trained classifier by calling classify() on the image.
    var out = combined.classify(classifier);

    //Risk Map based on model prediction

    var RiskNeighbors = out.focal_median(1.5);

    //#################################################################################################################
    //                                            Print the computed model
    //#################################################################################################################
    ////////////////////////////////////////////////////////////////////////////////
                  //terrain variables, elev, slope....

    //addToMap(elev.sldStyle(Elevation_PALETTE),{}, "Elevation");
    layers_config.basemaps[0] =get_idmap(elev.sldStyle(Elevation_PALETTE),{}, "Elevation");
    layers_config.basemaps[0][3]=0;
    layers_config.basemaps[0][4]=2000;
    //addToMap(slope_perc.sldStyle(Slope_PALETTE),{}, "Slope");
    ////////////////////////////////////////////////////////////////////////////////
                  //Distance to water

    //addToMap(dist_water.sldStyle(dist_to_water),{},"Distance_Water Bodies");
    layers_config.basemaps[1] =get_idmap(dist_water.sldStyle(dist_to_water),{},"Distance to Water Bodies");
    layers_config.basemaps[1][3]=0
    layers_config.basemaps[1][4]=0

    ////////////////////////////////////////////////////////////////////////////////
                  //NDVI normalized difference vegetation index

    //addToMap(ndvi.sldStyle(NDVI_PALETTE),{}, "NDVI");
    layers_config.basemaps[2] =get_idmap(ndvi.sldStyle(NDVI_PALETTE),{}, "NDVI");
    layers_config.basemaps[2][3]=0;
    layers_config.basemaps[2][4]=1;
    //addToMap(evi, {min:-1, max:1, bands:["EVI"], "palette": EVI_PALETTE}, "EVI");

    ////////////////////////////////////////////////////////////////////////////////
                  //NDWI normalized difference water index

    //addToMap(ndwi.sldStyle(NDWI_PALETTE),{},"NDWI");
    layers_config.basemaps[3] =get_idmap(ndwi.sldStyle(NDWI_PALETTE),{},"NDWI");
    layers_config.basemaps[3][3]=-0.2;
    layers_config.basemaps[3][4]=0.5;

    ////////////////////////////////////////////////////////////////////////////////
                  //LST: land surface temperature

    //addToMap(lst.sldStyle(LST_PALETTE),{}, "LST"); // "palette": LST_PALETTE
    layers_config.basemaps[4] =get_idmap(lst.sldStyle(LST_PALETTE),{}, "LST");
    layers_config.basemaps[4][3]=24
    layers_config.basemaps[4][4]=32


    ////////////////////////////////////////////////////////////////////////////////
                 // Map the model result Resampled

    //addToMap(out, {min:0, max:1, palette: ["0000FF", "66FFCC", "FFCC00", "00CCFF", "FF0000"]}, "Model Random Forest");
    //addToMap(out, {min:0, max:1, palette: ["0000CC", "0075CC", "00CCAF", "FFE300", "CC7500", "CC0000"]}, "Model Random Forest");
    // addToMap(RiskNeighbors.sldStyle(sld_intervals), {}, 'Malaria Risk Map Resampled');

    layers_config.overlays[0] =get_idmap(RiskNeighbors.sldStyle(sld_intervals), {}, 'Malaria Risk Map Resampled');
    layers_config.overlays[0][3]=0
    layers_config.overlays[0][4]=1
    //print(RiskNeighbors.sldStyle(sld_intervals).getMap(),'test')

    ////////////////////////////////////////////////////////////////////////////////
                 // Map the model result
    //addToMap(out, {}, 'Malaria Risk Map');
    //addToMap(out.sldStyle(sld_intervals), {}, 'Malaria Risk Map1');

    layers_config.overlays[1] =get_idmap(out.sldStyle(sld_intervals), {}, 'Malaria Risk Map');
    layers_config.overlays[1][3]=0
    layers_config.overlays[1][4]=1

    ////////////////////////////////////////////////////////////////////////////////
                  //Water bodies
    //Map.addLayer(water.sldStyle(water_palette), {}, 'Water Bodies Hansen');
    layers_config.overlays[2] =get_idmap(water.sldStyle(water_palette), {}, 'Water Bodies Hansen');
    layers_config.overlays[2][3]=0;
    layers_config.overlays[2][4]=1;

    checkTokens(layers_config);

    return layers_config;
  }

  // Shows a button prompting the user to log in.
  function onImmediateFailed(e) {
    // If the login is succeeds, run the analysis
    ee.data.authenticateViaPopup(runAnalysis);
  }

  // Start application when DOM is ready
  function onReady() {
    var controlZoom = new L.Control.Zoom({ position: 'topright' });

    // Creating map
    map = L.map('map', {
      center: [-26.5824, 31.0226],
      zoom: 9, zoomControl: false
    });

    controlZoom.addTo(map);

    // Attempt to authenticate using existing credentials.
    ee.data.authenticate(CLIENT_ID, runAnalysis, null, null, onImmediateFailed);
  }

  document.addEventListener('DOMContentLoaded', onReady);

})();
