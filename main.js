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
  lines: L.featureGroup(),//.addTo(map),
  stops: L.featureGroup(),//.addTo(map),
  zones: L.featureGroup(),//.addTo(map),
  hotels: L.featureGroup(),//.addTo(map),
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

  let myIcon = L.icon({
    iconUrl: 'icons/photo.png',
    iconAnchor: [16, 37],
    popupAnchor: [0, -37],
  });

  L.geoJson(geojson, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
        icon: myIcon
      }).addTo(map);

      //return L.marker(latlng);
    },
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
    style: function (feature) {
      console.log(feature.properties.LINE_NAME)
      let lineName = feature.properties.LINE_NAME;
      let lineColor = "#111111";
      if (lineName == "Red Line") {
        lineColor = "#FF4136";
      } else if (lineName == "Yellow Line") {
        lineColor = "#FFDC00";
      } else if (lineName == "Blue Line") {
        lineColor = "#0074D9";
      } else if (lineName == "Green Line") {
        lineColor = "#2ECC40";
      } else if (lineName == "Grey Line") {
        lineColor = "#AAAAAA";
      } else if (lineName == "Orange Line") {
        lineColor = "#FF851B";
      }

      return {
        color: lineColor, //Randfarbe
        weight: 2,
      };
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`
        <h4><i class="fa-solid fa-bus"></i> ${feature.properties.LINE_NAME}</h4>
        <adress><i class="fa-regular fa-circle-stop"> </i>${feature.properties.FROM_NAME}</adress><br>
        <i class="fa-solid fa-arrow-down"></i><br>
        <adress><i class="fa-regular fa-circle-stop"> </i>${feature.properties.TO_NAME}</adress>
      `)
    }
  }).addTo(themaLayer.lines);
}




loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json")

/*
bus_1.png ////Red Line
bus_2.png ////Yellow Line
bus_3.png ////Blue Line
bus_4.png ////Green Line
bus_5.png ////Grey Line
bus_6.png ////Orange Line
*/


async function loadStops(url) {
  console.log("loading", url);
  let respone = await fetch(url);
  let geojson = await respone.json();


  L.geoJson(geojson, {
    pointToLayer: function (feature, latlng) {
      console.log(feature.properties)
      return L.marker(latlng, {
        icon: L.icon({
          iconUrl: `icons/bus_${feature.properties.LINE_ID}.png`,
          iconAnchor: [16, 37],
          popupAnchor: [0, -37],
        }),
      }).addTo(map);

      //return L.marker(latlng);
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`
        <h4><i class="fa-solid fa-bus"></i> ${feature.properties.LINE_NAME}</h4>
        <adress><i class="fa-solid fa-hand"></i> </i>${feature.properties.STAT_NAME}</adress><br>    
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
    style: function (feature) {
      return {
        color: "#F012BE", //Randfarbe
        weight: 1,
        opacity: 0.4,
        fillOpacity: 0.1,
      };


    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`
        <h4><i class="fa-solid fa-person-walking"></i> Fußgängerzone, ${feature.properties.ADRESSE}</h4>
        <i class="fa-regular fa-clock"></i> ${feature.properties.ZEITRAUM || "Dauerhaft geöffnet"}<br><br>
        <i class="fa-solid fa-circle-info"></i> ${feature.properties.AUSN_TEXT || "Keine Information"}
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
        <h3><i class="fa-solid fa-hotel"></i> ${feature.properties.BETRIEB}</h3>
        <h4> ${feature.properties.BETRIEBSART_TXT} (${feature.properties.KATEGORIE_TXT})</h4>
        <hr>
        Addr.: ${feature.properties.ADRESSE}<br>
        Tel.: ${feature.properties.KONTAKT_TEL}<br>
        E-Mail: <u>${feature.properties.KONTAKT_EMAIL}</u> 
        <button onclick="copyToClipboard('${feature.properties.KONTAKT_EMAIL}', this)">Copy</button><br>
        <a href="${feature.properties.WEBLINK1}">Homepage</a>

      `)
    }
  }).addTo(themaLayer.hotels);
}

loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json")

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    console.log('Text copied to clipboard');
    btn.textContent = 'Copied!';
  })
}

