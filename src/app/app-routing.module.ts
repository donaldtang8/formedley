import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
    { path: '', redirectTo: '/forms', pathMatch: 'full' },
    { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
    { path: 'forms', loadChildren: () => import('./features/forms/forms.module').then(m => m.CustomFormsModule) }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule]
})

export class AppRoutingModule {}