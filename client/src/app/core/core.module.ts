import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptorService } from './interceptors/auth-interceptor.service';
import { HeaderComponent } from './components/header/header.component';
import { HomePageComponent } from './pages/home/home-page.component';

@NgModule({
    declarations: [
        HeaderComponent,
        HomePageComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true
        }
    ],
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [
        HeaderComponent, 
        HomePageComponent
    ]
})

export class CoreModule {}