(function() {

var map = L.map('map', {
  center: [-26.5738, 31.5335],
  zoom: 9,
  zoomControl: false
});

new L.Control.Zoom({position: 'topright'}).addTo(map);

L.tileLayer('http://a.tiles.mapbox.com/v4/adammulligan.f826072c/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYWRhbW11bGxpZ2FuIiwiYSI6ImNiMDYxMzkwOGJjYTJjZjhmZmY3YmUyZTljMDZjZGNjIn0.E30Oy7L6hXBm2vtmQoWZJA').addTo(map);

var baseMaps = {};
LAYERS_CONFIG.basemaps.forEach(function(layerConfig, index) {
  var layer = L.tileLayer('https://earthengine.googleapis.com/map/'+layerConfig[0]+'/{z}/{x}/{y}?token='+layerConfig[1])
  baseMaps[layerConfig[2]] = layer;

  // Set first layer as default
  if (index === 0) { layer.addTo(map); }
});

var malariaLayers = { };
LAYERS_CONFIG.overlays.forEach(function(layerConfig, index) {
  var layer = L.tileLayer('https://earthengine.googleapis.com/map/'+layerConfig[0]+'/{z}/{x}/{y}?token='+layerConfig[1])
  malariaLayers[layerConfig[2]] = layer;

  // Set first layer as default
  if (index === 0) { layer.addTo(map); }
});

L.control.layers(baseMaps, malariaLayers, {position: 'topleft', collapsed: false}).addTo(map);

})();
