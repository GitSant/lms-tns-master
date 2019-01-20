import { Component, NgZone } from "@angular/core";
import * as Geolocation from "nativescript-geolocation";

@Component({
    selector: "GeoLocation",
    moduleId: module.id,
    templateUrl: "./geolocation.component.html"
})
export class GeoLocationComponent {

    latitude: number;
    longitude: number;
    private watchId: number;

    constructor(private zone: NgZone) {
        this.latitude = 0;
        this.longitude = 0;
    }

    // tslint:disable-next-line:member-ordering
    updateLocation() {
        this.getDeviceLocation().then((result) => {
            this.latitude = result.latitude;
            this.longitude = result.longitude;
        }, (error) => {
            console.error(error);
        });
    }

    // tslint:disable-next-line:member-ordering
    startWatchingLocation() {
        this.watchId = Geolocation.watchLocation((location) => {
            if(location) {
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
                Geolocation.getCurrentLocation({timeout: 10000}).then((location) => {
                    resolve(location);
                }).catch((error) => {
                    reject(error);
                });
            });
        });
    }
}
