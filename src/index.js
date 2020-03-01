import mapStyles from './map-styles'
const csv = require('csvtojson')
import { get } from 'https'
import { TextDecoder } from 'text-encoding'

const getData = () => {
  const promise = new Promise((resolve, reject) => {
    get(
      'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv',
      async resp => {
        resp.on('data', async data => {
          const csvData = new TextDecoder('utf-8').decode(data)
          const json = await csv().fromString(csvData)
          console.log(json)
          resolve(json)
        })
      }
    )
  })
  return promise
}

function color()
  {
    
    var myOptions = {
      style: [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6b9a76'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9ca5b3'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#746855'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#f3d19c'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#2f3948'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#515c6d'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        }
      ]
    };
    map.set(myOptions);
  }

window.initMap = async () => {
  const data = await getData()
  console.log(data)

  // Create the map.
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: { lat: 31, lng: 112 },
    mapTypeId: 'terrain',
  })

var heatMapData = [];
var circles = [];

  // Construct the circle for each value in citymap.
  // Note: We scale the area of the circle based on the population.
  for (var i = 0; i < data.length; i++) {
    var lat = data[i].Lat;
    var long = data[i].Long;
    var numberOfPeople = data[i]['2/28/20'];

    // Add the circle for this city to the map.
    var cityCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: {lat: Number(lat), lng: Number(long)},
      radius: Math.pow(numberOfPeople, 1/8) * 100000,
    })

    circles[i] = cityCircle;
    
    heatMapData[i] = [{
      location: new google.maps.LatLng(10, 10), weight: 10
      //location: new google.maps.LatLng(cityCircle.center), weight: 10   //{lat: Number(lat), lng: Number(long)}), weight: Math.sqrt(numberOfPeople)
    }];

    console.log(heatMapData[i]);

    //if(numberOfPeople > 1000)
        //document.getElementById("console").innerHTML = "Coronavirus Infectious Map"; 
  }
  ////////////////////////////////////////   MAP CONTROL CODE //////////////////////////////////////////////


  var contentStringBackup = "Number Infected: " + "50" + "<br>"
  "Number Dead:" + "<br>"
  "Coordinates: (" + "100" + ", " + "200" + ")" + "<br>"
  "";

  // var contentString = "Number Infected: " + this.radius/50 + "<br>"
  // "Number Dead:" + "<br>"
  // "Coordinates: (" + this.center.Lat + ", " + this.center.Long + ")" + "<br>"
  // "";

var infowindow = new google.maps.InfoWindow({
  content: contentStringBackup
});

// var marker = new google.maps.Marker({
//   position: myLatLng,
//   map: map,
//   title: "City"
// });

//var HeatmapLayer = new google.maps.HeatmapLayer();

var heatmap =  new google.maps.visualization.HeatmapLayer({
  data: heatMapData,
  radius: 10,
  map: map
});

heatmap.setMap(map);

google.maps.event.addListener(cityCircle, 'mouseOver',function(){
  infowindow.open(map);
  alert("hi");
});


var markers = [];

  //overlay.setMap(map)
function marker()
{
  for(var i = 0; i < data.length; i++){
    var marker = new google.maps.Marker({
      position: circles[i].center,
      map: map,
      title: Math.round(Math.pow(circles[i].radius/100000, 8)) + " infected \n" + circles[i].center
    });
    markers[markers.length] = marker;
    
  }
}
marker();

var newCircle = new google.maps.Circle({
  strokeColor: '#FFFFFF',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FFFFFF',
  fillOpacity: 0.35,
  map: map,
  center: {lat: 10, lng: 10},
  radius: 500
})

console.log(newCircle)

  //////////////////////////////////// SPREAD ALGORITHM //////////////////////////////////////////

  //window.setInterval(spread(circles), 1000);

  // for(var n = 0; n < circles.length; n++)
  // {
  //   for(var i = 0; i < 4; i++)
  //   {
  //     var newCircle = new google.maps.Circle({
  //       strokeColor: '#00FF00',
  //       strokeOpacity: 0.8,
  //       strokeWeight: 2,
  //       fillColor: '#00FF00',
  //       fillOpacity: 0.35,
  //       map: map,
  //       center: {lat: 10, lng: 10},
  //       radius: location.radius/50 * 0.1
  //     })
  //   }
  // }

  // function spread(loc)
  // {
  //   for(var i = 0; i < loc.length; i++)
  //   {
  //     console.log(loc[i])
  //     var newCircle = new google.maps.Circle({
  //       strokeColor: '#00FF00',
  //       strokeOpacity: 0.8,
  //       strokeWeight: 2,
  //       fillColor: '#00FF00',
  //       fillOpacity: 0.35,
  //       map: map,
  //       center: {lat: Number(10), lng: Number(10)},
  //       radius: location.radius/50 * 0.1
  //     })
  //   }
  // }
  /*
    function spread(data) {
      const dist = 10
      var additionalData = []
      function appendToAditionalData(location, latDist, longDist) {
          additionalData.push({
              lat: Number(location.center.lat) + latDist,
              long: Number(location.center.long) + longDist,
              numberOfPeople: location.numberOfPeople * 0.1
          })
      }
      for (const location in data) {
          appendToAditionalData(location, dist, dist)
          appendToAditionalData(location, dist, -dist)
          appendToAditionalData(location, -dist, dist)
          appendToAditionalData(location, -dist, -dist)
          location.numberOfPeople = Number(location.numberOfPeople) * 1.5
      }
      data = [...data, ...additionalData]
  }*/
}



