import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { ApplyLeaveComponent } from './apply-leave.component';

const routes: Routes = [
  { path: "", component: ApplyLeaveComponent }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class ApplyLeaveRoutingModule { }
