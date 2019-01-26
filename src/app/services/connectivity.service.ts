import { Injectable } from "@angular/core";
import * as connectivity from "connectivity";
import * as permissions from "nativescript-permissions";

declare var android: any;
@Injectable({
  providedIn: "root"
})
export class ConnectivityService {

  connectWith: string;

  checkConnection(): void {
    // if (
    //   connectivity.getConnectionType() ===
    //   (connectivity.connectionType.wifi || connectivity.connectionType.mobile)
    // ) {
    //   return true;
    // } else {
    //   return false;
    // }
    // tslint:disable-next-line:max-line-length
    permissions.requestPermission(android.Manifest.permission.ACCESS_NETWORK_STATE, "TekysPortal needs to access to the Internet. Please connect to WiFi or Mobile Data!")
            .then(() => {
                console.log("Permission Granted!");
                switch (connectivity.getConnectionType()) {
                    case connectivity.connectionType.none:
                        this.connectWith = "None";
                        console.log("none");
                        break;
                    case connectivity.connectionType.wifi:
                        this.connectWith = "Wi-Fi";
                        console.log("wifi");
                        break;
                    case connectivity.connectionType.mobile:
                        this.connectWith = "Mobile";
                        console.log("mobile");
                        break;
                    default:
                        break;
                }

            })
            .catch(() => {
                console.log("Permission Denied!");
            });
  }
}
