import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

import { FormBuilderComponent } from './form-builder/form-builder.component';
import { DiscoverComponent } from './discover/discover.component';
import { ResponseFormComponent } from './response/response-form/response-form-component';

const routes: Routes = [
    { path: '', redirectTo: '/create', pathMatch: 'full' },
    {
        path: 'create',
        component: FormBuilderComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'discover',
        component: DiscoverComponent,
        canActivate: [AuthGuard]
    },
    { 
        path: 'id/:id',
        component: ResponseFormComponent,
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class FormsRoutingModule {}