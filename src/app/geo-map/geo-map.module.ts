import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { GeoMapRoutingModule } from './geo-map-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { GeoMapComponent } from './geo-map.component';

@NgModule({
  declarations: [GeoMapComponent],
  imports: [
    GeoMapRoutingModule,
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class GeoMapModule { }
