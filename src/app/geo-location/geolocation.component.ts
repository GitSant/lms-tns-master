import { Component, NgZone } from "@angular/core";
import * as Geolocation from "nativescript-geolocation";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";

@Component({
    selector: "GeoLocation",
    moduleId: module.id,
    templateUrl: "./geolocation.component.html",
    styleUrls: ['./geolocation.component.css'],
})
export class GeoLocationComponent {

    latitude: number;
    longitude: number;
    private watchId: number;
    busyindicator: boolean = false;

    constructor(private zone: NgZone) {
        this.latitude = 0;
        this.longitude = 0;
    }

    // tslint:disable-next-line:member-ordering
    updateLocation() {
        // this.busyindicator = true;
        this.getDeviceLocation().then((result) => {
            this.busyindicator = false;
            this.latitude = result.latitude;
            this.longitude = result.longitude;
        }, (error) => {
            this.busyindicator = false;
            console.error( error);
        });
    }

    // tslint:disable-next-line:member-ordering
    startWatchingLocation() {
        this.watchId = Geolocation.watchLocation((location) => {
            if (location) {
                this.zone.run(() => {
                    this.latitude = location.latitude;
                    this.longitude = location.longitude;
                });
            }
        }, (error) => {
            console.log(error);
        }, { updateDistance: 1, minimumUpdateTime: 1000 });
    }

    stopWatchingLocation() {
        if (this.watchId) {
            Geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }

    private getDeviceLocation(): Promise<any> {
        return new Promise((resolve, reject) => {
            Geolocation.enableLocationRequest().then(() => {
                this.busyindicator = true;
                Geolocation.getCurrentLocation({ timeout: 20000 }).then((location) => {
                    resolve(location);
                }).catch((error) => {
                    reject(error);
                });
            });
        });
    }
}
