import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormsRoutingModule } from './forms-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { FormInputBuilderComponent } from './form-builder-input/form-input-builder.component';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
    declarations: [
        FormBuilderComponent,
        FormInputBuilderComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FormsRoutingModule,
        SharedModule,
        CoreModule
    ]
})

export class CustomFormsModule {}