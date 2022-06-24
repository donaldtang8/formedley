import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';

import * as fromApp from '../../../store/app.reducer';
import * as AuthActions from '../../../store/auth/auth.actions';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated = false;
    private userSubscription: Subscription;

    constructor(private store: Store<fromApp.AppState>) {}

    ngOnInit() {
        this.userSubscription = this.store
            .select('auth')
            .pipe(
                map(authState => authState.user)
            )
            .subscribe(user => {
                this.isAuthenticated = !!user;
            });
    }

    onLogout() {
        this.store.dispatch(new AuthActions.Logout());
    }

    ngOnDestroy() {
        this.userSubscription.unsubscribe();
    }
}