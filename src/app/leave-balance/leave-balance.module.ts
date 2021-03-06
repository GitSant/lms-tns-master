import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { LeaveBalanceRoutingModule } from './leave-balance-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { LeaveBalanceComponent } from './leave-balance.component';
import { DropDownModule } from "nativescript-drop-down/angular";
import {NativeScriptFormsModule} from "nativescript-angular/forms";
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [LeaveBalanceComponent],
  imports: [
    LeaveBalanceRoutingModule,
    NativeScriptCommonModule,
    DropDownModule,
    NativeScriptFormsModule,
    SharedModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class LeaveBalanceModule { }
