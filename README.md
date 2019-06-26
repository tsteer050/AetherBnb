# AetherBnb
AetherBnB is a hospitality service application inspired by AirBnB.  Technologies used include MongoDB, Express, React & Node.js. Mapping functions were built using the Google Maps API.  You can check out the live deployment [here.](https://aetherbnb.herokuapp.com)

![Screen Shot 2019-06-26 at 9 58 16 AM](https://user-images.githubusercontent.com/6785491/60199754-79f10400-97f9-11e9-9eeb-364df93060de.png)

AetherBnB allows users to search by location via implementation of [react-places-autocomplete](https://github.com/hibiken/react-places-autocomplete).  The `geocodeByAddress` and `getLatLng` methods are used to transform the entered (or auto-completed) location into coordinates usable by Google Maps as in the example below:

```
//auto_complete.jsx

handleSelect = address => {
  this.setState({ address });
  if (window.map) {
    window.preventFetch = true;
    geocodeByAddress(address)
      .then(results => {getLatLng(results[0])
      .then(({lat, lng}) => { 
        window.locationObj = new google.maps.LatLng(lat, lng);
        window.map.panTo(window.locationObj);
      });
      this.activateSearch();
    });
  } else {
    ...
  }
};
```

The resulting properties are filtered by location, as well as by occupancy, price and availability components in the top bar.  Map pins representing the properties are rendered on the map using the `createMarkerFromSpot(spot)` method.  The Google Maps infowindow is leveraged to create custom miniature property views in the map when the corresponding pin is clicked without suffering the performance issues of adding a unique custom marker to each location.  Infowindows are updated as such:

```
//marker_manager.js

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
In addition to placement on the initial search, search results and their cooresponding map markers are updated on map movement.  The code below includes initial map setup, as well as updates based on the new map position.  The `receiveBounds(bounds)` method calls an associated Redux action, passing up the new map bounds which then return to the map in the `componentDidUpdate` method where they are in turn passed to `MarkerManager.updateMarkers`, which filters and re-renders the map spot pins.

```
// spot_map.jsx


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


