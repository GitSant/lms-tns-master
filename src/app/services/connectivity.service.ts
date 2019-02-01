import { Injectable } from "@angular/core";
import * as connectivity from "connectivity";
import { alert } from "tns-core-modules/ui/dialogs";

declare var android: any;
let alertOptions = {
    title: "Connection Error",
    message: "",
    okButtonText: "OK"
};

@Injectable({
    providedIn: "root"
})
export class ConnectivityService {
    checkConnection() {
        const connectionType = connectivity.getConnectionType();
        if ((connectionType === connectivity.connectionType.wifi) || (connectionType === connectivity.connectionType.mobile)) {
            return true;
        } else {
            alertOptions.message = "No Internet Access found! Please connect to WiFi or Mobile Data.";
            alert(alertOptions).then(() => { });
            return false;
        }
    }
}
