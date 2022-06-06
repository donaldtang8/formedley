import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

import { FormBuilderComponent } from './form-builder/form-builder.component';

const routes: Routes = [
    { path: '', redirectTo: '/create', pathMatch: 'full' },
    {
        path: 'create',
        component: FormBuilderComponent,
        canActivate: [AuthGuard]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class FormsRoutingModule {}