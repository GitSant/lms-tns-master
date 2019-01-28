import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { GeoMapComponent } from './geo-map.component';

const routes: Routes = [
  { path: "", component: GeoMapComponent }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class GeoMapRoutingModule { }
