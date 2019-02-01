import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { GeoMapRoutingModule } from './geo-map-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { GeoMapComponent } from './geo-map.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [GeoMapComponent],
  imports: [
    GeoMapRoutingModule,
    NativeScriptCommonModule,
    SharedModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class GeoMapModule { }
