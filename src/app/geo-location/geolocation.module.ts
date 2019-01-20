import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { GeoLocationRoutingModule } from "./geolocation-routing,module";
import { GeoLocationComponent } from "./geolocation.component";
@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    GeoLocationRoutingModule
  ],
  declarations: [GeoLocationComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class GeoLocationModule {}
