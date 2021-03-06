import { HttpClientModule } from "@angular/common/http";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import {NativeScriptFormsModule} from "nativescript-angular/forms";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ModalDatetimepicker } from "nativescript-modal-datetimepicker";
import { SharedModule } from "./shared/shared.module";
import * as platform from "platform";
declare var GMSServices: any;

if(platform.isIOS) {
    GMSServices.provideAPIKey("AIzaSyBIYR3AYWV86x6AhWYInL3P46KgSpIRXHM");
}

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptUISideDrawerModule,
        HttpClientModule,
        SharedModule
    ],
    declarations: [
        AppComponent
    ],
    providers:[
        ModalDatetimepicker
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
