// create a map in the "map" div, set the view to a given place and zoom
var map = L.map('map').setView([-26.5738, 31.5335], 9);

// add a basemap tile layer
L.tileLayer('http://a.tiles.mapbox.com/v3/darkit.lok07npe/{z}/{x}/{y}.png', {   
}).addTo(map);

//add a GEE layer
L.tileLayer('https://earthengine.googleapis.com/map/{mapId}/{z}/{x}/{y}?token={token}'
).addTo(map);