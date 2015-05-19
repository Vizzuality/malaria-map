var map = L.map('map', {
  center: [-26.5738, 31.5335],
  zoom: 9
});

var defaultBaseMap = L.tileLayer('http://a.tiles.mapbox.com/v3/darkit.lok07npe/{z}/{x}/{y}.png').addTo(map);
var baseMaps = { "Road": defaultBaseMap };

var layersConfig = [
  // Fill me in
  // {name: 'name', map_id: '', token: ''}
];

var malariaLayers = {};
layersConfig.forEach(function(layerConfig, index) {
  var layer = L.tileLayer('https://earthengine.googleapis.com/map/'+layerConfig.map_id+'/{z}/{x}/{y}?token='+layerConfig.token)
  malariaLayers[layerConfig.name] = layer;

  // Set first layer as default
  if (index === 0) { layer.addTo(map); }
});

L.control.layers(baseMaps, malariaLayers).addTo(map);
