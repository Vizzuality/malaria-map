(function() {

var map = L.map('map', {
  center: [-26.5738, 31.5335],
  zoom: 9,
  zoomControl: false
});

new L.Control.Zoom({position: 'topright'}).addTo(map);


var baseLayers = {
  'Road Map': L.tileLayer('http://a.tiles.mapbox.com/v4/adammulligan.f826072c/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYWRhbW11bGxpZ2FuIiwiYSI6ImNiMDYxMzkwOGJjYTJjZjhmZmY3YmUyZTljMDZjZGNjIn0.E30Oy7L6hXBm2vtmQoWZJA').addTo(map),
  'Satellite': L.tileLayer('http://a.tiles.mapbox.com/v4/adammulligan.m8ei7b99/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYWRhbW11bGxpZ2FuIiwiYSI6ImNiMDYxMzkwOGJjYTJjZjhmZmY3YmUyZTljMDZjZGNjIn0.E30Oy7L6hXBm2vtmQoWZJA')
};

var groupedOverlays = {
  "base": {},
  "risk": {}
}

LAYERS_CONFIG.overlays.forEach(function(layerConfig, index) {
  var layer = L.tileLayer('https://earthengine.googleapis.com/map/'+layerConfig[0]+'/{z}/{x}/{y}?token='+layerConfig[1])
  groupedOverlays.risk[layerConfig[2]] = layer;

  // Set first layer as default
  if (index === 0) { layer.addTo(map); }
});

LAYERS_CONFIG.basemaps.forEach(function(layerConfig, index) {
  var layer = L.tileLayer('https://earthengine.googleapis.com/map/'+layerConfig[0]+'/{z}/{x}/{y}?token='+layerConfig[1])
  groupedOverlays.base[layerConfig[2]] = layer;
});

L.control.groupedLayers(baseLayers, groupedOverlays, {
  exclusiveGroups: ["base"],
  position: 'topleft',
  collapsed: false
}).addTo(map);

})();
