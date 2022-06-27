import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

import { FormBuilderComponent } from './form-builder/form-builder.component';
import { FormComponent } from './form/form.component';
import { FormResponseBuilderComponent } from './form-response/form-response-builder.component';
import { ResponsesComponent } from './responses/responses.component';
import { ResponseItemComponent } from './responses/response-item/response-item.component';
import { MyFormsComponent } from './form/my-forms/my-forms.component';
import { MyResponsesComponent } from './responses/my-responses/my-responses.component';

const routes: Routes = [
    { path: '', redirectTo: '/create', pathMatch: 'full' },
    {
        path: 'create',
        component: FormBuilderComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'me',
        component: MyFormsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'form/:id/response/:responseId',
        component: ResponseItemComponent,
        canActivate: [AuthGuard]
    },
    // {
    //     path: 'form/:id/response',
    //     component: FormResponseBuilderComponent,
    //     canActivate: [AuthGuard]
    // },
    {
        path: 'form/:id/responses',
        component: ResponsesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'form/:id',
        component: FormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'responses/me',
        component: MyResponsesComponent,
        canActivate: [AuthGuard]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class FormsRoutingModule {}