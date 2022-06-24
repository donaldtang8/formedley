import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { HeaderComponent } from './core/components/header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { CustomFormsModule } from './features/forms/forms.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import * as fromApp from './store/app.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { FormsEffects } from './store/forms/forms.effects';
import { ResponsesEffects } from './store/responses/responses.effects';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CustomFormsModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([AuthEffects, FormsEffects, ResponsesEffects ]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    SharedModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
