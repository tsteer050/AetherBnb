# AetherBnb
Web App implementing Google Maps API and developed on the MERN Stack


![Screen Shot 2019-06-26 at 9 58 16 AM](https://user-images.githubusercontent.com/6785491/60199754-79f10400-97f9-11e9-9eeb-364df93060de.png)

creating map markers from spots
```
createMarkerFromSpot(spot) {
const position = { lat: spot.lat, lng: spot.lng };
var contentString =
'<div id="content">' +
'<div id="siteNotice">' +
"</div >" +
`<img style="max-height: 120px; max-width: 200px;" alt="" src=${
spot.images[0].img_url
}>` +
`<h1 id="firstHeading" class="firstHeading" style="max-width: 200px; word-break: break-word;"><b>${
spot.name
}</b></h1>` +
'<div id="bodyContent">' +
`<p><b>$${spot.price} per night</b></p>` +
"</div>" +
"</div>";

var infowindow = new google.maps.InfoWindow({
content: contentString
});

const marker = new google.maps.Marker({
position,
map: this.map,
label: {
text: `$${spot.price}`,
fontSize: "9px",
fontWeight: "bold"
},
spotId: spot._id
});
marker.addListener("click", function() {
infowindow.open(this.map, marker);
});
this.markers[marker.spotId] = marker;
}
```
map setup
```
componentDidMount() {
let mapOptions = {
center: this.props.searchParams.location,
zoom: 14
};

let map = this.refs.map;
window.map = this.map = new google.maps.Map(map, mapOptions);
window.markerManager = this.MarkerManager = new MarkerManager(this.map);
this.MarkerManager.updateMarkers(this.props.spots);
this.map.addListener('bounds_changed', () => {
let mapBounds = this.map.getBounds();
let southWest = mapBounds.getSouthWest();
let northEast = mapBounds.getNorthEast();
let bounds = { sw: { lat: southWest.lat(), lng: southWest.lng() },
ne: { lat: northEast.lat(), lng: northEast.lng() }};
this.props.receiveBounds(bounds);

let location = this.map.getCenter();
this.props.receiveLocation(location);
});
}

componentDidUpdate(prevProps, prevState) {
if (!_.isEqual(prevProps.searchParams.location, this.props.searchParams.location)) {
this.MarkerManager.updateMarkers(this.props.spots);
}
}
```

auto complete search bar address add:
```
handleSelect = address => {
this.setState({ address });
if (window.map) {
window.preventFetch = true;
geocodeByAddress(address).then(results => {
getLatLng(results[0]).then(({lat, lng}) => {
window.locationObj = new google.maps.LatLng(lat, lng);
window.map.panTo(window.locationObj);
});
this.activateSearch();
});
}
```
