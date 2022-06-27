import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormsRoutingModule } from './forms-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { FormComponent } from './form/form.component';
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { MyFormsComponent } from './form/my-forms/my-forms.component';
import { FormInputBuilderComponent } from './form-builder/form-input-builder/form-input-builder.component';
import { FormResponseBuilderComponent } from './form-response/form-response-builder.component';
import { FormInputResponseComponent } from './form-response/form-response-builder/form-input-response/form-input-response.component';
import { FormListComponent } from './form/form-list/form-list.component';
import { FormItemComponent } from './form/form-item/form-item.component';
import { FormViewComponent } from './form/form-view/form-view.component';
import { ResponsesComponent } from './responses/responses.component';
import { ResponseItemComponent } from './responses/response-item/response-item.component';
import { ResponseListComponent } from './responses/responses-list/response-list.component';
import { MyResponsesComponent } from './responses/my-responses/my-responses.component';

@NgModule({
    declarations: [
        FormComponent,
        FormListComponent,
        FormItemComponent,
        MyFormsComponent,
        FormViewComponent,
        FormBuilderComponent,
        FormInputBuilderComponent,
        FormResponseBuilderComponent,
        FormInputResponseComponent,
        ResponsesComponent,
        ResponseItemComponent,
        ResponseListComponent,
        MyResponsesComponent
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