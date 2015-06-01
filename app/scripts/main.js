(function() {

var map = L.map('map', { center: [-26.5824, 31.0226], zoom: 9, zoomControl: false });
new L.Control.Zoom({position: 'topright'}).addTo(map);

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

})();
