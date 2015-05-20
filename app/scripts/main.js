(function() {

var map = L.map('map', {
  center: [-26.5738, 31.5335],
  zoom: 9
});

var defaultBaseMap = L.tileLayer('http://a.tiles.mapbox.com/v3/darkit.lok07npe/{z}/{x}/{y}.png').addTo(map);
var baseMaps = { "Road": defaultBaseMap };

var malariaLayers = {};
LAYERS_CONFIG.forEach(function(layerConfig, index) {
  var layer = L.tileLayer('https://earthengine.googleapis.com/map/'+layerConfig[0]+'/{z}/{x}/{y}?token='+layerConfig[1])
  malariaLayers[layerConfig[2]] = layer;

  // Set first layer as default
  if (index === 0) { layer.addTo(map); }
});

L.control.layers(baseMaps, malariaLayers).addTo(map);

})();
