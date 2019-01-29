import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ApplyLeaveRoutingModule } from './apply-leave-routing.module';
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { ApplyLeaveComponent } from './apply-leave.component';
import {DropDownModule} from 'nativescript-drop-down/angular';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ApplyLeaveComponent],
  imports: [
    ApplyLeaveRoutingModule,
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    DropDownModule,
    SharedModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ApplyLeaveModule { }
