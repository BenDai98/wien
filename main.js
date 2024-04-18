/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt
let stephansdom = {
  lat: 48.208493,
  lng: 16.373118,
  title: "Stephansdom",
};

// Karte initialisieren
let map = L.map("map").setView([stephansdom.lat, stephansdom.lng], 12);

// BasemapAT Layer mit Leaflet provider plugin als startLayer Variable
let startLayer = L.tileLayer.provider("OpenTopoMap");
startLayer.addTo(map);

let themaLayer = {
  sights: L.featureGroup().addTo(map),
  lines: L.featureGroup().addTo(map),
  stops: L.featureGroup().addTo(map),
  zones: L.featureGroup().addTo(map),
  hotels: L.featureGroup().addTo(map),
}



// Hintergrundlayer
L.control
  .layers({
    "OpenTopoMap": startLayer,
    "BasemapAT Grau": L.tileLayer.provider("BasemapAT.grau"),
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT Beschriftung": L.tileLayer.provider("BasemapAT.overlay"),
  }, {
    "Sehenwürdigkeiten": themaLayer.sights,
    "Linien": themaLayer.lines,
    "Stops": themaLayer.stops,
    "Zones": themaLayer.zones,
    "Hotels": themaLayer.hotels,
  })
  .addTo(map);

// Marker Stephansdom
L.marker([stephansdom.lat, stephansdom.lng])
  .addTo(map)
  .bindPopup(stephansdom.title)
  .openPopup();

// Maßstab
L.control
  .scale({
    imperial: false,
  })
  .addTo(map);


L.control.fullscreen().addTo(map);


async function loadSights(url) {
  console.log("loading", url);
  let respone = await fetch(url);
  let geojson = await respone.json();
  L.geoJson(geojson, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`
        <img src="${feature.properties.THUMBNAIL}" alt="*">
        <h4><a href="${feature.properties.WEITERE_INF}" target="wien">${feature.properties.NAME}</a></h4>
        <adress>${feature.properties.ADRESSE}</adress>
      `)
    }
  }).addTo(themaLayer.sights);
}


loadSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json");


async function loadLines(url) {
  console.log("loading", url);
  let respone = await fetch(url);
  let geojson = await respone.json();
  L.geoJson(geojson, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`
        <img src="${feature.properties.THUMBNAIL}" alt="*">
        <h4><a href="${feature.properties.WEITERE_INF}" target="wien">${feature.properties.NAME}</a></h4>
        <adress>${feature.properties.ADRESSE}</adress>
      `)
    }
  }).addTo(themaLayer.lines);
}

loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json")


async function loadStops(url) {
  console.log("loading", url);
  let respone = await fetch(url);
  let geojson = await respone.json();
  L.geoJson(geojson, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`
        <img src="${feature.properties.THUMBNAIL}" alt="*">
        <h4><a href="${feature.properties.WEITERE_INF}" target="wien">${feature.properties.NAME}</a></h4>
        <adress>${feature.properties.ADRESSE}</adress>
      `)
    }
  }).addTo(themaLayer.stops);
}

loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json")

async function loadZones(url) {
  console.log("loading", url);
  let respone = await fetch(url);
  let geojson = await respone.json();
  L.geoJson(geojson, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`
        <img src="${feature.properties.THUMBNAIL}" alt="*">
        <h4><a href="${feature.properties.WEITERE_INF}" target="wien">${feature.properties.NAME}</a></h4>
        <adress>${feature.properties.ADRESSE}</adress>
      `)
    }
  }).addTo(themaLayer.zones);
}

loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json")

async function loadHotels(url) {
  console.log("loading", url);
  let respone = await fetch(url);
  let geojson = await respone.json();
  L.geoJson(geojson, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`
        <img src="${feature.properties.THUMBNAIL}" alt="*">
        <h4><a href="${feature.properties.WEITERE_INF}" target="wien">${feature.properties.NAME}</a></h4>
        <adress>${feature.properties.ADRESSE}</adress>
      `)
    }
  }).addTo(themaLayer.hotels);
}

loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json")

