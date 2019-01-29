import { Component, OnInit } from '@angular/core';
import { registerElement } from 'nativescript-angular/element-registry';
import { MapView, Marker, Position } from "nativescript-google-maps-sdk";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { ImageSource, fromFile, fromResource, fromBase64 } from "tns-core-modules/image-source";

// Important - must register MapView plugin in order to use in Angular templates
registerElement('MapView', () => MapView);

@Component({
  selector: 'ns-geo-map',
  templateUrl: './geo-map.component.html',
  styleUrls: ['./geo-map.component.css'],
  moduleId: module.id,
})
export class GeoMapComponent {

  // latitude = -33.86;
  // longitude = 151.20;
  latitude = 17.4415726;
  longitude = 78.396732;
  zoom = 18;
  minZoom = 0;
  maxZoom = 22;
  bearing = 0;
  tilt = 0;
  padding = [40, 40, 40, 40];
  mapView: MapView;
  lastCamera: String;

  constructor() {
  }

  //Map events
  onMapReady(event) {
    console.log('Map Ready');

    this.mapView = event.object;

    console.log("Setting a marker...");

    const ryderPin: ImageSource = <ImageSource>fromResource("rydermappin");
    console.log(ryderPin);
    var marker = new Marker();
    marker.position = Position.positionFromLatLng(this.latitude, this.longitude);
    marker.title = "Tekyslab";
    marker.snippet = "Hyderabad";
    marker.userData = { index: 1 };
    //marker.icon=ryderPin;
    this.mapView.addMarker(marker);

    console.log("Marker set.");
  }

  onCoordinateTapped(args) {
    console.log("Coordinate Tapped, Lat: " + args.position.latitude + ", Lon: " + args.position.longitude, args);
  }

  onMarkerEvent(args) {
    console.log("Marker Event: '" + args.eventName
      + "' triggered on: " + args.marker.title
      + ", Lat: " + args.marker.position.latitude + ", Lon: " + args.marker.position.longitude, args);
  }

  onCameraChanged(args) {
    console.log("Camera changed: " + JSON.stringify(args.camera), JSON.stringify(args.camera) === this.lastCamera);
    this.lastCamera = JSON.stringify(args.camera);
  }

  onCameraMove(args) {
    console.log("Camera moving: " + JSON.stringify(args.camera));
  }
}
